import React from "react";
import myIcon from "../../assets/ImagineboIcon.svg"; // Adjust the path as necessary
import { Menu, LayoutGrid, Users, Settings, User } from "lucide-react";

export default function AdminSidebar() {
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

        {/* Faded menu icon */}
        <SidebarIcon icon={<Menu />} faded />

        <SidebarIcon icon={<LayoutGrid />} />
        <SidebarIcon icon={<Users />} />
        <SidebarIcon icon={<Settings />} />
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
        <SidebarIcon icon={<User />} />
      </div>
    </div>
  );
}

interface SidebarIconProps {
  icon: React.ReactElement;
  faded?: boolean;
}

function SidebarIcon({ icon, faded }: SidebarIconProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "24px",
        height: "24px",
        color: faded ? "rgba(209, 209, 209, 0.5)" : "#d1d1d1",
      }}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
  );
}
