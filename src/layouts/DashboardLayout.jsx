import SideBar from "../components/SideBar";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";
import logo from "../assets/wallet-talk-logo.svg";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ fullName, user, onLogout }) => {
  const greetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour >= 12 && hour <= 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <img src={logo} alt="WalletTalk Logo" className="w-44 h-auto" />
            <div className="flex gap-4 items-center">
              {/* <ThemeToggle /> */}
              <ProfileDropdown fullName={fullName} onLogout={onLogout} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-400 mb-4">
            {greetingMessage()}, <span className="text-purple-600">{fullName ? fullName.split(" ")[0] : user?.email}</span>
          </h1>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
