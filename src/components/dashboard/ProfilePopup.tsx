import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { Camera, User, Shield, CreditCard, MessageCircle, Settings, Eye, EyeOff, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: string;
}

  const ProfilePopup = ({ open, onOpenChange, initialSection = 'basic' }: ProfilePopupProps) => {
  const { user, profile, updateProfile } = useUser();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '••••••••••'
  });

  // Update active section when initialSection prop changes
  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const handleSave = async () => {
    // Save profile data
    console.log('Saving profile data:', formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '••••••••••'
    });
    onOpenChange(false);
  };

  const menuItems = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'integration', label: 'Integration', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Credits and Billing', icon: CreditCard },
    { id: 'support', label: 'Support and feedback', icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Info</h3>
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-8 px-2"
                >
                  <Camera className="h-3 w-3 mr-1" />
                  Edit photo
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-background pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div> */}

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Label>Account Plan</Label>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  Pro Plan
                </Badge>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">150k daily tokens remaining.</span>
                <Button variant="link" className="p-0 h-auto text-blue-500">
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'integration':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Integrations</h3>
            <p className="text-muted-foreground">Manage your connected services and integrations.</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Connect GitHub
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Connect Vercel
              </Button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-muted-foreground">Manage your account security and privacy settings.</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Login History
              </Button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Credits & Billing</h3>
              <p className="text-muted-foreground text-sm">Manage your subscription, usage, and billing information</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Current Usage */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Current Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credits Used</span>
                        <span className="text-muted-foreground">1240/2000</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Method</h4>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">••••</span>
                      </div>
                      <span className="font-mono text-sm">•••• •••• •••• 1892</span>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>

                {/* Next Billing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Next Billing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>October 1, 2026</span>
                      <span className="text-muted-foreground">Auto Renew enabled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="space-y-4">
                  <h4 className="font-medium">Current Plan</h4>
                  <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Pro Plan</div>
                        <div className="text-sm text-muted-foreground">2,000 credits</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-2xl font-bold">$29.99</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <span className="mr-2">✨</span>
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Support & Feedback</h3>
              <p className="text-muted-foreground text-sm">Get help or share your thoughts with our team</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="billing">Billing Issue</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your feedback"
                    className="bg-background"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your feedback..."
                    className="bg-background min-h-[120px] resize-none pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[500px] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 border-r p-4 space-y-1">
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* <DialogHeader className="p-6 pb-4">
              <DialogTitle>
                {menuItems.find(item => item.id === activeSection)?.label || 'Profile Settings'}
              </DialogTitle>
            </DialogHeader> */}

            <div className="flex-1 mt-5 px-6 pb-4 overflow-y-auto">
              {renderContent()}
            </div>

            {/* Footer with Save/Cancel buttons - only show on basic info */}
            {activeSection === 'basic' && (
              <div className="border-t p-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePopup;