import React from "react";
import TeamPage from "../components/dashboard/TeamPage";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext"; // ✅ use context

const Teams = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser(); // ✅ get from context

  const handleLogout = () => {
    logout(); // ✅ logout via context
    navigate("/", { state: { logout: true } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        onLogout={handleLogout}
      />
      <TeamPage onLogout={handleLogout} />
    </div>
  );
};

export default Teams;
