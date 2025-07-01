
import React from 'react';
import TeamPage from '../components/dashboard/TeamPage';
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

  return <TeamPage onLogout={handleLogout} />;
};

export default Teams;
