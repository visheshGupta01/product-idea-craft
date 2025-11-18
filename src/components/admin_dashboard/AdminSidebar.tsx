import React from "react";
import myIcon from "../../assets/ImagineboIcon.svg"; // Adjust the path as necessary
import { Menu, LayoutGrid, Users, Settings, User, MessageCircle, LogOut, Code, Shield } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { logout } = useUser();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate("/");
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
        {/* Replace logo placeholder with image */}
        <a href="/admin" className="mb-24">
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

        {/* Faded menu icon */}

        <SidebarIcon
          icon={<LayoutGrid />}
          active={activeView === "dashboard"}
          onClick={() => onViewChange("dashboard")}
        />
        <SidebarIcon
          icon={<Users />}
          active={activeView === "users"}
          onClick={() => onViewChange("users")}
        />
        <SidebarIcon
          icon={<Code />}
          active={activeView === "developers"}
          onClick={() => onViewChange("developers")}
        />
        <SidebarIcon
          icon={<Shield />}
          active={activeView === "admins"}
          onClick={() => onViewChange("admins")}
        />
        <SidebarIcon
          icon={<MessageCircle />}
          active={activeView === "feedback"}
          onClick={() => onViewChange("feedback")}
        />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Divider line above User icon */}
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
