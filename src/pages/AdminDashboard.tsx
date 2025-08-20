import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin_dashboard/AdminSidebar';
import RevenueCard from '@/components/admin_dashboard/RevenueCard';
import UserGrowthChart from '@/components/admin_dashboard/UserGrowthChart';
import MetricsCards from '@/components/admin_dashboard/MetrixCard';
import AnalyticsSection from '@/components/admin_dashboard/MapAnalytics';
import DropRateCard from '@/components/admin_dashboard/DropRateCard';


const AdminDashboard: React.FC = () => {
  const { logout, userRole } = useUser();

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

  return (
    <div className="flex bg-gradient-to-b from-[#D5E1E7] to-[#FFEEF9] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-16 p-6 space-y-6">
        {/* Revenue Section */}
        <RevenueCard />

        {/* Main Dashboard Layout - User Growth Chart and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart (takes 2/3) */}
          <div className="lg:col-span-2">
            <UserGrowthChart />
          </div>

          {/* Metrics Cards (takes 1/3) */}
          <div className="lg:col-span-1">
            <MetricsCards />
          </div>
        </div>

        {/* More Analytics Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            More Analytics
          </h2>
          <div className="flex gap-6">
            <div className="w-80">
              <AnalyticsSection />
            </div>
            <div className="w-80">
              <DropRateCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
