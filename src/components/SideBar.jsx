import { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BanknotesIcon,
  CreditCardIcon,
  InboxStackIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/wallet-talk-logo.svg';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const sideBarRef = useRef(null)

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/dashboard/income', icon: ArrowTrendingUpIcon, label: 'Income' },
    { path: '/dashboard/expenses', icon: ArrowTrendingDownIcon, label: 'Expenses' },
    { path: '/dashboard/budgets', icon: BanknotesIcon, label: 'Budgets' },
    { path: '/dashboard/savings', icon: InboxStackIcon, label: 'Savings' },
    { path: '/dashboard/investments', icon: CurrencyDollarIcon, label: 'Investments' },
  ];

  useEffect(()=> {
    const handleClickOutside = (e) => {
        if (sideBarRef.current && !sideBarRef.current.contains(e.target) && !isCollapsed){
            setIsCollapsed(true)
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isCollapsed]);

  return (
    <div ref={sideBarRef} className={`bg-black/90 h-screen border-r border-gray-400/5 shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-48 absolute md:relative z-40'}`}>
      <div className="p-4 flex justify-end">
        <img
          src={logo}
          alt="Wallet Talk Logo"
          className={`w-40 h-auto mx-auto mb-1 mt-3 items-center pl-10 ${isCollapsed ? 'hidden' : ''}`}
        />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-purple-400 "
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5 text-purple-500" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5 text-purple-500" />
          )}
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 transition-colors ${
                isActive
                  ? 'bg-purple-800/50  text-purple-600 '
                  : 'text-gray-400  hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-6 w-6" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
