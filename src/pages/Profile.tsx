import React from "react";
import UserProfilePage from "../components/dashboard/UserProfilePage";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext"; // ✅ context hook

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // ✅ get user from context

  const handleLogout = () => {
    setUser(null); // ✅ clear user from context
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
      <UserProfilePage />
    </div>
  );
};

export default Profile;
