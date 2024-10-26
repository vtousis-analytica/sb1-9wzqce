import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, Building2, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Work', href: '/my-work', icon: FileText },
  { name: 'Body Shops', href: '/body-shops', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center h-16 px-4">
        <h1 className="text-xl font-bold text-white">Insurance Estimator</h1>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser?.name}</p>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full mt-4 text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}