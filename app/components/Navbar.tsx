'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('nav') && !target.closest('button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" onClick={handleLinkClick}>
          <div className="flex items-center cursor-pointer space-x-3">
            <img 
              src="/assets/logo.jpg" 
              alt="ClothStore Logo" 
              className="h-16 w-auto rounded" 
            />
            <span className="text-3xl font-bold text-yellow-500 tracking-wide">
              Dabeezo Atlas
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium items-center">
          <Link href="/product" className="text-green-600 hover:text-green-700 transition-colors">
            Products
          </Link>
          <Link href="/About" className="text-green-600 hover:text-green-700 transition-colors">
            About
          </Link>
          <Link href="/Contact" className="text-green-600 hover:text-green-700 transition-colors">
            Contact
          </Link>
          <Link href="/CartPage" className="text-green-600 hover:text-green-700 transition-colors">
            Cart
          </Link>
          <Link href="/blogpage" className="text-green-600 hover:text-green-700 transition-colors">
            Blog
          </Link>
          
          {isAdmin && (
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Logout Admin
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }} 
            className="text-green-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Improved */}
      {isOpen && (
        <div 
          className="md:hidden bg-white shadow-lg border-t border-gray-200 absolute w-full left-0 top-full animate-slideDown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 space-y-3 text-lg font-medium">
            <Link 
              href="/product" 
              className="block text-green-600 hover:text-green-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleLinkClick}
            >
              Products
            </Link>
            <Link 
              href="/About" 
              className="block text-green-600 hover:text-green-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link 
              href="/Contact" 
              className="block text-green-600 hover:text-green-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
            <Link 
              href="/CartPage" 
              className="block text-green-600 hover:text-green-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleLinkClick}
            >
              Cart
            </Link>
            <Link 
              href="/blogpage" 
              className="block text-green-600 hover:text-green-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleLinkClick}
            >
              Blog
            </Link>
            
            {isAdmin && (
              <button 
                onClick={handleLogout}
                className="block text-red-600 hover:text-red-700 font-medium w-full text-left py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout Admin
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;