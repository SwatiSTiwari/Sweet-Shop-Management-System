import React from 'react';
import { Candy, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onAuthClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Candy className="h-8 w-8 text-orange-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              Sweet Shop
            </h1>
            {isAdmin && (
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Admin
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-gray-700">
                  <User size={16} className="mr-1" />
                  <span>{user.email}</span>
                </div>
                
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Settings}
                  >
                    Admin Panel
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  icon={LogOut}
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onAuthClick}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};