import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./services/supabase";

import AuthForm from "./components/AuthForm";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

import DashboardLayout from "./layouts/DashboardLayout";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import VoiceInput from "./components/VoiceInput";

import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import BudgetsPage from "./pages/BudgetsPage";
import SavingsPage from "./pages/SavingsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from "react-hot-toast"
import {toast} from 'react-hot-toast'
import TransactionItem from "./pages/TransactionItem";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle session and profile
  useEffect(() => {
    const getUserAndProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error: ", error.message);
        return;
      }

      setUser(user);

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile) setFullName(profile.full_name);
        if (profileError) console.error("Profile fetch error:", profileError.message);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        supabase
          .from("users")
          .select("full_name")
          .eq("id", sessionUser.id)
          .single()
          .then(({ data }) => setFullName(data?.full_name));

        const isPublicRoute = ["/", "/auth", "/pricing", "/checkout"].includes(location.pathname);
        if (isPublicRoute) {
          navigate("/dashboard");
        }
      }
    });

    getUserAndProfile();
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
    toast.success("Logout successful!");
  };

  if (isLoading) return <SplashScreen />;

  return (
    <div className="bg-gray-900 min-h-screen">
      <div><Toaster/></div>

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={<AuthForm onAuthSuccess={(u) => setUser(u)} />}
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage user={user} />} />

        {/* PROTECTED ROUTES */}
        {user && (
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                user={user}
                fullName={fullName}
                onLogout={handleLogout}
              />
            }
          >
            <Route
              index
              element={
                <>
                  <SummaryCards user={user} refreshCount={refreshCount} />
                  <VoiceInput
                    user={user}
                    onSave={() => setRefreshCount((c) => c + 1)}
                  />
                  <div className="grid md:grid-cols-2 gap-2 md:my-10">
                    <TransactionForm
                      user={user}
                      onSave={() => setRefreshCount((c) => c + 1)}
                    />
                    <TransactionList user={user} />
                  </div>
                  
                </>
              }
            />
            <Route path="income" element={<IncomePage user={user} />} />
            <Route
              path="expenses"
              element={<ExpensesPage user={user} refreshCount={refreshCount} />}
            />
            <Route path="budgets" element={<BudgetsPage user={user} />} />
            <Route path="savings" element={<SavingsPage user={user} />} />
            <Route
              path="investments"
              element={<InvestmentsPage user={user} />}
            />
            <Route path="profile" element={<ProfilePage user={user} />} />
            <Route path="transactions/:id" element={<TransactionItem user={user} />} />
          </Route>
        )}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
