import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard,
  Edit,
  Save,
  X,
  Upload,
} from 'lucide-react';
import GitHubIntegration from './GitHubIntegration';
import VercelIntegration from './VercelIntegration';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface UserProfilePageProps {
  onLogout?: () => void;
}

const UserProfilePage = ({ onLogout }: UserProfilePageProps) => {
  const { profile, fetchProfile, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    city: '',
    frontend_stack: '',
    backend_stack: '',
    database_stack: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        country: profile.country || '',
        city: profile.city || '',
        frontend_stack: profile.frontend_stack || '',
        backend_stack: profile.backend_stack || '',
        database_stack: profile.database_stack || ''
      });
    }
  }, [profile]);

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    updates: true
  });

  const handleSave = async () => {
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };
  const stats = [
    { label: 'Tasks Assigned', value: profile?.total_assigned_tasks?.toString() || '0', color: 'text-blue-600' },
    { label: 'Bugs Solved', value: profile?.total_solved_bugs?.toString() || '0', color: 'text-green-600' },
    { label: 'Balance', value: `$${profile?.balances?.toFixed(2) || '0.00'}`, color: 'text-yellow-600' },
    { label: 'Plan', value: profile?.is_plan_active ? 'Active' : 'Inactive', color: profile?.is_plan_active ? 'text-green-600' : 'text-gray-600' }
  ];

  return (
    <div className="h-full bg-background">
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" />
                        <AvatarFallback className="text-xl">JD</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">
                        {profile?.first_name} {profile?.last_name}
                      </h3>
                      <p className="text-muted-foreground">{profile?.email}</p>
                      <Badge variant={profile?.is_plan_active ? "default" : "secondary"} className="mt-2">
                        {profile?.is_plan_active ? `${profile.price?.name || 'Active'} Plan` : 'Free Plan'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="github">GitHub</TabsTrigger>
                  <TabsTrigger value="vercel">Vercel</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={profileData.first_name}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={profileData.last_name}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled={true}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={profileData.country}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="frontend_stack">Frontend Stack</Label>
                          <Input
                            id="frontend_stack"
                            value={profileData.frontend_stack}
                            disabled={!isEditing}
                            placeholder="e.g., React, Vue, Angular"
                            onChange={(e) => setProfileData({...profileData, frontend_stack: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backend_stack">Backend Stack</Label>
                          <Input
                            id="backend_stack"
                            value={profileData.backend_stack}
                            disabled={!isEditing}
                            placeholder="e.g., Node.js, Python, Java"
                            onChange={(e) => setProfileData({...profileData, backend_stack: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="database_stack">Database Stack</Label>
                          <Input
                            id="database_stack"
                            value={profileData.database_stack}
                            disabled={!isEditing}
                            placeholder="e.g., MongoDB, PostgreSQL, MySQL"
                            onChange={(e) => setProfileData({...profileData, database_stack: e.target.value})}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="github" className="space-y-6">
                  <GitHubIntegration />
                </TabsContent>

                <TabsContent value="vercel" className="space-y-6">
                  <VercelIntegration />
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Password</h4>
                          <Button variant="outline">Change Password</Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Sessions</h4>
                          <Button variant="outline">View Active Sessions</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch 
                            checked={notifications.email}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, email: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications in browser
                            </p>
                          </div>
                          <Switch 
                            checked={notifications.push}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, push: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Marketing Communications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and tips
                            </p>
                          </div>
                          <Switch 
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, marketing: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Product Updates</h4>
                            <p className="text-sm text-muted-foreground">
                              Get notified about important product changes
                            </p>
                          </div>
                          <Switch 
                            checked={notifications.updates}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, updates: checked})
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">
                              {profile?.price?.name || 'Free Plan'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {profile?.price?.price ? `$${profile.price.price}/month` : 'Free'} • 
                              {profile?.plan_expires_at 
                                ? ` Expires: ${new Date(profile.plan_expires_at).toLocaleDateString()}`
                                : ' No expiration'
                              }
                            </p>
                          </div>
                          <Badge variant={profile?.is_plan_active ? "default" : "secondary"}>
                            {profile?.is_plan_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline">Change Plan</Button>
                          <Button variant="outline">View Invoices</Button>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-medium mb-2">Payment Method</h4>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
