import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import myIcon from "../../assets/ImagineboIcon.svg";
import { 
  User, 
  CheckSquare, 
  LogOut,
  Home,
  BarChart3
} from "lucide-react";

interface DeveloperSidebarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export default function DeveloperSidebar({ activeView, onViewChange }: DeveloperSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path: string, view?: string) => {
    navigate(path);
    if (onViewChange && view) {
      onViewChange(view);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className="fixed flex flex-col items-center justify-between py-6 left-0 top-1/2 transform -translate-y-1/2 bg-black rounded-r-[25px]"
      style={{
        width: "50px",
        height: "550px",
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <a href="/">
          <img
            src={myIcon}
            alt="Logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </a>

        <SidebarIcon
          icon={<Home />}
          active={isActive("/developer")}
          onClick={() => handleNavigation("/developer")}
        />
        <SidebarIcon
          icon={<User />}
          active={isActive("/developer/profile")}
          onClick={() => handleNavigation("/developer/profile")}
        />
        <SidebarIcon
          icon={<CheckSquare />}
          active={isActive("/developer/tasks")}
          onClick={() => handleNavigation("/developer/tasks")}
        />
        <SidebarIcon
          icon={<BarChart3 />}
          active={isActive("/developer/analytics")}
          onClick={() => handleNavigation("/developer/analytics")}
        />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Divider line above Logout icon */}
        <div
          style={{
            width: "70%",
            height: "0.5px",
            backgroundColor: "#555",
          }}
        ></div>
        <SidebarIcon icon={<LogOut />} onClick={handleLogout} />
      </div>
    </div>
  );
}

interface SidebarIconProps {
  icon: React.ReactElement;
  faded?: boolean;
  active?: boolean;
  onClick?: () => void;
}

function SidebarIcon({ icon, faded, active, onClick }: SidebarIconProps) {
  return (
    <div
      className={`flex items-center justify-center cursor-pointer transition-colors ${
        active ? 'bg-white/10 rounded-lg' : 'hover:bg-white/5 rounded-lg'
      }`}
      style={{
        width: "32px",
        height: "32px",
        color: faded ? "rgba(209, 209, 209, 0.5)" : active ? "#ffffff" : "#d1d1d1",
      }}
      onClick={onClick}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
  );
}