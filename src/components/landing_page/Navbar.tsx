import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useUser } from '@/context/UserContext';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';
import Logo from "../..//assets/ImagineboDarkBackground.svg"; // Adjust if needed

const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  return (
    <nav className="bg-[#1B2123] shadow-[0_8px_24px_rgba(0,0,0,0.5)] fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1732px] mx-auto h-[60px] px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div>
          <img
            src={Logo}
            alt="Imagine.bo"
            className="h-10 object-contain"
          />
        </div>

        {/* Menu items - Hidden on mobile */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-white text-[12px] font-medium font-supply">
          <a href="#about" className="hover:text-pink-400 transition">
            About Us
          </a>
          <a href="#community" className="hover:text-pink-400 transition">
            Community
          </a>
          <a href="#pricing" className="hover:text-pink-400 transition">
            Pricing
          </a>
          <a href="#testimonies" className="hover:text-pink-400 transition">
            Testimonies
          </a>
        </div>

        {/* Authentication block - Responsive */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">Welcome, {user?.name}</span>
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-black"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="w-[180px] md:w-[220px] h-[30px] flex items-center rounded-[7px] shadow-md overflow-hidden font-supply bg-[#D5E1E7]">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="w-1/2 h-full text-black text-xs md:text-sm font-medium hover:bg-gray-100 transition"
            >
              Login
            </button>
            <div className="w-[1px] h-[70%] bg-black" />
            <button 
              onClick={() => setShowSignupModal(true)}
              className="w-1/2 h-full text-black text-xs md:text-sm font-medium hover:bg-gray-100 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      
      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
