import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut, 
  Activity,
  Database,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin_dashboard/AdminSidebar';
import RevenueCard from '@/components/admin_dashboard/RevenueCard';
import UserGrowthChart from '@/components/admin_dashboard/UserGrowthChart';
import MetricsCards from '@/components/admin_dashboard/MetrixCard';
import AnalyticsSection from '@/components/admin_dashboard/MapAnalytics';
import DropRateCard from '@/components/admin_dashboard/DropRateCard';
import AdminTopbar from '@/components/admin_dashboard/AdminTopbar';
import RevenueDonut from '@/components/admin_dashboard/RevenueDonut';

const AdminDashboard: React.FC = () => {
  const { logout, userRole } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalSessions: 3456,
    pendingVerifications: 23
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinedAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'pending', joinedAt: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', status: 'active', joinedAt: '2024-01-13' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', joinedAt: '2024-01-12' },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

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
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-16 p-6 space-y-6">
        {/* Revenue Section */}
        <RevenueCard />

        {/* Growth Chart and Metrics Side by Side */}
        <div className="flex gap-6">
          <div className="flex-1">
            <UserGrowthChart />
          </div>
          <div className="w-80">
            <MetricsCards />
          </div>
        </div>

        {/* More Analytics Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">More Analytics</h2>
          <div className="flex gap-6">
            <AnalyticsSection />
            <DropRateCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
