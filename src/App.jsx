import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import VoiceInput from "./components/VoiceInput"
import { supabase } from "./services/supabase"
import AuthForm from "./components/AuthForm"
import TransactionList from "./components/TransactionList"
import BudgetsPage from "./pages/BudgetsPage"
import SideBar from "./components/SideBar"
import ExpensesPage from "./pages/ExpensesPage"
import IncomePage from "./pages/IncomePage"
import NotFound from "./pages/NotFound"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import TransactionForm from "./components/TransactionForm"
import logo from "./assets/wallet-talk-logo.svg"
import SummaryCards from "./components/SummaryCards"
import ThemeToggle from "./components/ThemeToggle"
import PricingPage from "./pages/PricingPage"
import CheckoutPage from "./pages/CheckoutPage"
import AnimatedSection from "./components/AnimatedSection"
import ProfileDropdown from "./components/ProfileDropdown"
import ProfilePage from "./pages/ProfilePage"
import SplashScreen from "./components/SplashScreen"
import SavingsPage from "./pages/SavingsPage"
import InvestmentsPage from "./pages/InvestmentsPage"

function App() {
  const [user, setUser] = useState(null)
  const [fullName, setFullName] = useState("")
  const [refreshCount, setrefreshCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const timer = setTimeout(()=> setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  },[])

  useEffect(() => {
    const getUserAndProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Auth error: ", error.message)
        return
      }

      setUser(user)

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single()

        if (profile) setFullName(profile.full_name)
        if (profileError)
          console.error("Profile fetch error:", profileError.message)
      }
    }

    // Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser)

      if (sessionUser) {
        supabase
          .from("users")
          .select("full_name")
          .eq("id", sessionUser.id)
          .single()
          .then(({ data }) => setFullName(data?.full_name))
      }
    });

    getUserAndProfile();
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast.success('Logout successfull!')
  }

  if (isLoading) return <SplashScreen onComplete={() => setIsLoading(false)} />

  if (!user) return <AuthForm onAuthSuccess={(u) => setUser(u)} />

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <SideBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        pauseOnHover
        theme="light"
      />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex flex-col sm:flex-col sm:justify-between  gap-4 mb-4">
            {/* Logo and Logout button*/}
            <div className="flex justify-between items-center gap-3">
              <img
                src={logo}
                alt="WalletTalk Logo"
                className="w-44 h-auto items-center object-contain drop-shadow-sm"
              />
              <div>
                {/* <ThemeToggle /> */}
                {/* <button 
                className="self-start sm:self-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleLogout}
                >
                  Logout
                </button> */}
                <ProfileDropdown
                  fullName={fullName}
                  onLogout={handleLogout}
                />
              </div>
            </div>

            {/* welcome message */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome, {fullName ? fullName.split(" ")[0] : user.email}
            </h1>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AnimatedSection direction="left">
                    <SummaryCards 
                      user={user} 
                      refreshCount={refreshCount} 
                    />
                  </AnimatedSection>

                  <AnimatedSection direction="right">
                    <TransactionForm
                      user={user}
                      onSave={() => setrefreshCount((c) =>c+1)}
                    />
                  </AnimatedSection>

                  <AnimatedSection direction="left">
                    <VoiceInput 
                      user={user} 
                      onSave={() => setrefreshCount((c) =>c+1)} />
                    </AnimatedSection>

                  <AnimatedSection direction="right">
                    <TransactionList user={user} />
                  </AnimatedSection>
                </>
              }
            />
            <Route path="/expenses" element={<ExpensesPage user={user} refreshCount={refreshCount} />} />
            <Route path="/income" element={<IncomePage user={user} />} />
            <Route path="/budgets" element={<BudgetsPage user={user} />} />
            <Route path="/savings" element={<SavingsPage user={user} />} />
            <Route path="/investments" element={<InvestmentsPage user={user} />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout" element={<CheckoutPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="*" element={<NotFound user={user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App
