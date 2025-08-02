import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, BarChart3, Shield } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, monitor system performance, and configure settings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,432</div>
              <p className="text-xs text-muted-foreground">+8% from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Healthy
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Load</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">Within normal range</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, permissions, and access controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Users
              </Button>
              <Button className="w-full" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system settings, security, and integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Button>
              <Button className="w-full" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">New user registration</p>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
                <Badge variant="secondary">2 min ago</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">System backup completed</p>
                  <p className="text-sm text-muted-foreground">Database backup successful</p>
                </div>
                <Badge variant="secondary">15 min ago</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Security scan completed</p>
                  <p className="text-sm text-muted-foreground">No threats detected</p>
                </div>
                <Badge variant="secondary">1 hour ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;