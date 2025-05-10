import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Plus, LogIn, LogOut, School, Calculator, Box,Package  } from 'lucide-react'; // Import Box icon for inventory
import { Users } from 'lucide-react';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <School className="h-8 w-8 text-brand-indigo" />
              <span className="ml-2 text-2xl font-bold text-brand-indigo">NGO</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/schools"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors"
            >
              Schools
            </Link>

            {state.isAuthenticated && state.user?.role === 'admin' && (
              <>
                <Link
                  to="/central-finance"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Calculator className="h-4 w-4 mr-1" />
                  Central Finance
                </Link>
                <Link
                  to="/inventory"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Package className="h-4 w-4 mr-1 text-gray-800" />
                  Inventory
                </Link>
                <Link
                  to="/central-inventory"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Box className="h-4 w-4 mr-1 text-gray-800" />
                  Central Inventory
                </Link>
                <Link
                  to="/students"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Users className="h-4 w-4 mr-1 text-gray-800" />
                  Students
                </Link>
                <Link
                  to="/alumni"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Users className="h-4 w-4 mr-1 text-gray-800" />
                  Alumni
                </Link>
                <Link
                  to="/track-item-purchase"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 transition-colors flex items-center"
                >
                  Track Item Purchase
                </Link>
                  
                <Button
                  onClick={() => navigate('/add-school')}
                  className="bg-brand-blue hover:bg-brand-indigo text-white ml-2 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add School
                </Button>
              </>
            )}

            {state.isAuthenticated ? (
              <Button
                onClick={logout}
                variant="outline"
                className="border-brand-blue text-brand-blue hover:text-brand-indigo hover:border-brand-indigo ml-2 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-brand-blue text-brand-blue hover:text-brand-indigo hover:border-brand-indigo ml-2 flex items-center"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-brand-indigo hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/schools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50"
          >
            Schools
          </Link>

          {state.isAuthenticated && state.user?.role === 'admin' && (
            <>
              <Link
                to="/finance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 flex items-center"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Finance
              </Link>
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 flex items-center"
              >
                <Box className="h-4 w-4 mr-2" />
                Central Inventory
              </Link>
              <Link
                to="/add-school"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add School
              </Link>
            </>
          )}

          {state.isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-indigo hover:bg-gray-50 flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;