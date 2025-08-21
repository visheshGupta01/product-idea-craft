import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle
} from 'lucide-react';
import { fetchDashboardData, DashboardData } from '@/services/adminService';
import { toast } from 'sonner';
import AdminSidebar from '@/components/admin_dashboard/AdminSidebar';
import RevenueCard from '@/components/admin_dashboard/RevenueCard';
import UserGrowthChart from '@/components/admin_dashboard/UserGrowthChart';
import MetricsCards from '@/components/admin_dashboard/MetrixCard';
import MapAnalytics from '@/components/admin_dashboard/MapAnalytics';
import DropRateCard from '@/components/admin_dashboard/DropRateCard';
import UserManagement from '@/components/admin_dashboard/UserManagement';


const AdminDashboard: React.FC = () => {
  const { logout, userRole } = useUser();
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole === 'admin') {
      loadDashboardData();
    }
  }, [userRole]);

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UserManagement />;
      case 'dashboard':
      default:
        return (
          <div className="flex-1 ml-16 p-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            ) : dashboardData ? (
              <>
                {/* Revenue Section */}
                <RevenueCard data={dashboardData.revenueData} />

                {/* Main Dashboard Layout - User Growth Chart and Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* User Growth Chart (takes 2/3) */}
                  <div className="lg:col-span-2">
                    <UserGrowthChart data={dashboardData.yearlyStats} />
                  </div>

                  {/* Metrics Cards (takes 1/3) */}
                  <div className="lg:col-span-1">
                    <MetricsCards 
                      conversionRate={dashboardData.conversionRate}
                      userGrowthRate={dashboardData.userGrowthRate}
                      revenueData={dashboardData.revenueData}
                    />
                  </div>
                </div>

                {/* More Analytics Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    More Analytics
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MapAnalytics 
                      countryPercentages={dashboardData.countryPercentages}
                      countryGeoData={dashboardData.countryGeoData}
                    />
                    <DropRateCard droppingRate={dashboardData.droppingRate} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-600">
                Failed to load dashboard data
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-[#D5E1E7] to-[#FFEEF9] min-h-screen">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
