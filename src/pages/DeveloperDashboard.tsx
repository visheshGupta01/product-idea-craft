import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import DeveloperSidebar from '@/components/developer/DeveloperSidebar';
import DeveloperProfile from '@/components/developer/DeveloperProfile';
import DeveloperTasks from '@/components/developer/DeveloperTasks';
import FirstTimeSetup from '@/components/developer/FirstTimeSetup';
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

const DeveloperOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await developerService.getDeveloperProfile();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your development overview.</p>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">{stats.total_tasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.total_complete}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.total_pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">{stats.developer_info.rating.toFixed(1)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>Your developer profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground">Personal Information</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.developer_info.first_name} {stats.developer_info.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stats.developer_info.city}, {stats.developer_info.country}
                    </p>
                  </div>
                  
                  {stats.developer_info.company_name && (
                    <div>
                      <h4 className="font-medium text-foreground">Current Company</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stats.developer_info.company_name}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground">Professional Links</h4>
                    <div className="space-y-2 mt-1">
                      {stats.developer_info.github_url ? (
                        <div className="flex items-center space-x-2">
                          <Github className="h-4 w-4" />
                          <a 
                            href={stats.developer_info.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            GitHub Profile
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No GitHub profile linked</p>
                      )}
                      
                      {stats.developer_info.linkedin_url ? (
                        <div className="flex items-center space-x-2">
                          <Linkedin className="h-4 w-4" />
                          <a 
                            href={stats.developer_info.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No LinkedIn profile linked</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground">Account Status</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={stats.developer_info.is_plan_active ? "default" : "secondary"}>
                        {stats.developer_info.is_plan_active ? "Active Plan" : "Inactive Plan"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Balance: ${stats.developer_info.balances.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

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
            <Route path="/" element={<DeveloperOverview />} />
            <Route path="/profile" element={<DeveloperProfile />} />
            <Route path="/tasks" element={<DeveloperTasks />} />
            <Route path="/analytics" element={<DeveloperOverview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;