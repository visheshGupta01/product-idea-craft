import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import DeveloperSidebar from '@/components/developer/DeveloperSidebar';
import DeveloperProfile from '@/components/developer/DeveloperProfile';
import DeveloperTasks from '@/components/developer/DeveloperTasks';
import FirstTimeSetup from '@/components/developer/FirstTimeSetup';
import { DeveloperOverview } from '@/components/developer/DeveloperOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { developerService } from '@/services/developerService';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Star,
  Github,
  Linkedin
} from 'lucide-react';

const DeveloperDashboard = () => {
  const { userRole, isAuthenticated } = useUser();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await developerService.getDeveloperProfile();
      const profile = response.data.developer_info;
      
      // Check if GitHub and LinkedIn are set up
      setNeedsSetup(!profile.github_url || !profile.linkedin_url);
    } catch (error) {
      console.error('Failed to check setup status:', error);
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || userRole !== 'developer') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return <FirstTimeSetup onComplete={() => setNeedsSetup(false)} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <DeveloperSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Routes>
            <Route index element={<DeveloperOverview />} />
            <Route path="profile" element={<DeveloperProfile />} />
            <Route path="tasks" element={<DeveloperTasks />} />
            <Route path="analytics" element={<div className="p-6">Analytics coming soon...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;