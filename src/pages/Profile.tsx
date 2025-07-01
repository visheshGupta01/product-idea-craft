
import React from 'react';
import UserProfilePage from '../components/dashboard/UserProfilePage';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: { name: string; email: string; avatar?: string } | null;
}

const Profile = ({ user }: ProfileProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to home and trigger logout
    navigate('/', { state: { logout: true } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        onLogout={handleLogout}
      />
      <UserProfilePage onLogout={handleLogout} />
    </div>
  );
};

export default Profile;
