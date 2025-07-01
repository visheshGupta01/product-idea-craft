
import React from 'react';
import TeamPage from '../components/dashboard/TeamPage';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface TeamsProps {
  user: { name: string; email: string; avatar?: string } | null;
}

const Teams = ({ user }: TeamsProps) => {
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
      <TeamPage onLogout={handleLogout} />
    </div>
  );
};

export default Teams;
