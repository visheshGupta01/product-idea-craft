import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useUser } from '@/context/UserContext';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';
import { DeveloperEnrollmentForm } from '../developer/DeveloperEnrollmentForm';
import ProfilePopup from '../dashboard/ProfilePopup';
import { User, FolderOpen, Settings, LogOut, CreditCard, CheckSquare, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../..//assets/ImagineboDarkBackground.svg"; // Adjust if needed

const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDeveloperForm, setShowDeveloperForm] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileSection, setProfileSection] = useState<string>('basic-info');
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  return (
    <nav className="bg-[#1B2123] shadow-[0_2px_24px_rgba(0,0,0,0.5)] fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1732px] mx-auto h-[60px] px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div>
          <a href="/">
            <img src={Logo} alt="Imagine.bo" className="h-10 object-contain" />
          </a>
        </div>

        {/* Menu items - Hidden on mobile */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-white text-[12px] font-medium font-supply">
          <a
            href="https://imagine.bo"
            className="hover:text-pink-400 transition"
          >
            About Us
          </a>
          <a href="#community" className="hover:text-pink-400 transition">
            Community
          </a>
          <a href="/pricing" className="hover:text-pink-400 transition">
            Pricing
          </a>
          <a
            href="https://blog.imagine.bo"
            className="hover:text-pink-400 transition"
          >
            Blog
          </a>
        </div>

        {/* Authentication block - Responsive */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:text-pink-400"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-pink-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  Profile
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/projects")}>
                <FolderOpen className="h-4 w-4 mr-2" />
                My Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/inbox")}>
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tasks")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Tasks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileSection("basic");
                  setShowProfilePopup(true);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProfileSection("billing");
                  setShowProfilePopup(true);
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => {
                  setProfileSection("security");
                  setShowProfilePopup(true);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            {/* <div className="w-[100px] md:w-[120px] h-[30px] flex items-center rounded-[7px] shadow-md overflow-hidden font-supply bg-[#D5E1E7]">
              <button
                onClick={() => setShowDeveloperForm(true)}
                className="w-full h-full text-black text-xs md:text-sm font-medium hover:bg-gray-100 transition"
              >
                Enroll as Dev
              </button>
            </div> */}
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
      <DeveloperEnrollmentForm
        isOpen={showDeveloperForm}
        onClose={() => setShowDeveloperForm(false)}
      />
      <ProfilePopup
        open={showProfilePopup}
        onOpenChange={setShowProfilePopup}
        initialSection={profileSection}
      />
    </nav>
  );
};

export default Navbar;
