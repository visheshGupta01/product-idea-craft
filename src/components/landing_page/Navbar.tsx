import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useUser } from '@/context/UserContext';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';
import { DeveloperEnrollmentForm } from '../developer/DeveloperEnrollmentForm';
import ProfilePopup from '../dashboard/ProfilePopup';
import { User, FolderOpen, Settings, LogOut, CreditCard, CheckSquare, Inbox, BellDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from "../..//assets/ImagineboDarkBackground.svg"; // Adjust if needed
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDeveloperForm, setShowDeveloperForm] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileSection, setProfileSection] = useState<string>('basic-info');
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [notifications] = useState([
  {
    id: 1,
    title: "New project assigned",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "Subscription renewed successfully",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "You have a new message",
    time: "Yesterday",
  },
]);

  return (
    <nav className="bg-[#1B2123] border-b border-white rounded-lg fixed top-0 left-0 w-full z-50">
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

        <div className='flex gap-2'>
          {isAuthenticated && (
  <DropdownMenu>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 w-11 border-none rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <BellDot className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <DropdownMenuContent
      align="end"
      className="w-80 bg-[#1B2123] text-white border border-gray-700 p-0"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 text-sm font-medium">
        Notifications
      </div>

      {/* Notifications list */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex flex-col items-start gap-1 px-4 py-3 cursor-pointer hover:bg-gray-800"
            >
              <span className="text-sm">{item.title}</span>
              <span className="text-xs text-gray-400">{item.time}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No notifications
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700">
        <button
          onClick={() => navigate("/notifications")}
          className="w-full py-2 text-sm text-pink-400 hover:bg-gray-800"
        >
          View all
        </button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
)}

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
                    {user?.firstName && user?.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`
                      : `${user.firstName[0]}`}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : `${user.firstName}`}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user?.userType === "developer" ? (
                <DropdownMenuItem onClick={() => navigate("/developer")}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/projects")}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  My Projects
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate("/inbox")}>
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tasks")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Tasks
              </DropdownMenuItem>
              {user?.userType !== "developer" && (
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("basic");
                    setShowProfilePopup(true);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setProfileSection("billing");
                  setShowProfilePopup(true);
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </DropdownMenuItem>
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
            <div className="w-[180px] md:w-[220px] h-[30px] flex items-center rounded-[7px] shadow-md overflow-hidden font-supply bg-[#B1C5CE]">
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
