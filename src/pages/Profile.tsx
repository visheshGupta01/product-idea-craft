
import React from 'react';
import UserProfilePage from '../components/dashboard/UserProfilePage';
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

  return <UserProfilePage onLogout={handleLogout} />;
};

export default Profile;
