import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
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
} from '@heroicons/react/24/outline'
import logo from '../assets/wallet-talk-logo.svg'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/income', icon: ArrowTrendingUpIcon, label: 'Income' },
    { path: '/expenses', icon: ArrowTrendingDownIcon, label: 'Expenses' },
    { path: '/budgets', icon: BanknotesIcon, label: 'Budgets'},
    { path: '/savings', icon: InboxStackIcon, label: 'Savings'},
    { path: '/investments', icon: CurrencyDollarIcon, label: 'Investments' },
    { path: '/pricing', icon: CreditCardIcon, label: 'Pricing'},
  ]

  return (
    <div className={`bg-white h-screen shadow-lg transition-all duration-300  ${isCollapsed ? 'w-20' : 'w-40 absolute md:relative z-40'}`}>
      <div className="p-4 flex justify-end">
        <img src={logo} alt="Wallet Talk Logo" className={`w-40 h-auto mx-auto mb-1 mt-3 items-center pl-10 ${isCollapsed ? 'hidden' : ''}`} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon onClick={()=> setIsCollapsed(!isCollapsed)} className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon onClick={()=> setIsCollapsed(!isCollapsed)}  className="h-5 w-5" />
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
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-6 w-6" />
              {!isCollapsed && (
                <span className="ml-3" onClick={()=> setIsCollapsed(!isCollapsed)} >{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;