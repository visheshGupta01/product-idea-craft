import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CancelSubscriptionDialog from "@/components/ui/cancel-subscription-dialog";
import { cancelUserSubscription } from "@/services/adminService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import {
  Camera,
  User,
  Shield,
  CreditCard,
  MessageCircle,
  Settings,
  Eye,
  EyeOff,
  Bug,
  Plus,
  BarChart3,
} from "lucide-react";
import { getInitialsFromNames } from "@/lib/avatarUtils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  submitFeedback,
  getFeedbackCategories,
  FeedbackSubmission,
} from "@/services/feedbackService";
import { redirect, useNavigate } from "react-router-dom";
import { fetchUsageData, UsageData } from "@/services/usageService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProfilePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: string;
}

const ProfilePopup = ({
  open,
  onOpenChange,
  initialSection = "basic",
}: ProfilePopupProps) => {
  const { user, profile, updateProfile, fetchProfile } = useUser();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showPassword, setShowPassword] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const navigate = useNavigate();

  // Use actual profile data from API
  const userData = profile;

  // Fetch profile when popup opens
  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open, fetchProfile]);

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    password: "••••••••••",
  });

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "••••••••••",
      });
      // console.log("User data loaded into form:", userData);
    }
  }, [userData]);

  // Update active section when initialSection prop changes
  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const handleSave = async () => {
    // Save profile data
    //console.log('Saving profile data:', formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form data
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "••••••••••",
      });
    }
    onOpenChange(false);
  };

  const menuItems = [
    { id: "basic", label: "Basic Info", icon: User },
    // { id: 'integration', label: 'Integration', icon: Settings },
    // { id: 'security', label: 'Security', icon: Shield },
    { id: "billing", label: "Credits and Billing", icon: CreditCard },
    { id: "usage", label: "Usage Stats", icon: BarChart3 },
    { id: "support", label: "Report and Issue", icon: Bug },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "basic":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Info</h3>
            {/* Form Fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="px-3 py-2 bg-muted/30 border rounded-md text-sm">
                {formData.name || "Not provided"}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="px-3 py-2 bg-muted/30 border rounded-md text-sm pr-10">
                  {formData.email || "Not provided"}
                </div>
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
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground"
                >
                  {userData?.plan_id === 1
                    ? "Free Plan"
                    : userData?.plan_id === 2
                    ? "Pro Plan"
                    : userData?.plan_id === 3
                    ? "Enterprise Plan"
                    : "Free Plan"}
                </Badge>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="space-y-2">
                <Label>Credits</Label>
                <div className="px-3 py-2 bg-muted/30 border rounded-md text-sm">
                  {userData?.credits || 0} credits
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Active
                </Badge>
              </div>
              {userData?.user_type === "developer" && (
                <>
                  <div className="space-y-2">
                    <Label>Tasks Statistics</Label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="px-2 py-1 bg-muted/30 border rounded-md text-center">
                        <div className="font-medium">
                          {userData?.total_solved_tasks || 0}
                        </div>
                        <div className="text-muted-foreground">Solved</div>
                      </div>
                      <div className="px-2 py-1 bg-muted/30 border rounded-md text-center">
                        <div className="font-medium">
                          {userData?.total_in_progress_task || 0}
                        </div>
                        <div className="text-muted-foreground">In Progress</div>
                      </div>
                      <div className="px-2 py-1 bg-muted/30 border rounded-md text-center">
                        <div className="font-medium">
                          {userData?.total_pending_task || 0}
                        </div>
                        <div className="text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </div>
                  {userData?.rating_count > 0 && (
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="px-3 py-2 bg-muted/30 border rounded-md text-sm">
                        {userData?.avg_rating?.toFixed(2)} ⭐ (
                        {userData?.rating_count} reviews)
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "integration":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Integrations</h3>
            <p className="text-muted-foreground">
              Manage your connected services and integrations.
            </p>
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

      case "security":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-muted-foreground">
              Manage your account security and privacy settings.
            </p>
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

      case "billing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Credits & Billing</h3>
              <p className="text-muted-foreground text-sm">
                Manage your subscription, usage, and billing information
              </p>
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
                        <span>Credits Remaining</span>
                        <span className="text-muted-foreground">
                          {userData?.credits || 0}
                        </span>
                      </div>
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
                        <div className="font-medium">
                          <div className="font-medium">
                            {userData?.plan_id === 1
                              ? "Free Plan"
                              : userData?.plan_id === 2
                              ? "Pro Plan"
                              : userData?.plan_id === 3
                              ? "Enterprise Plan"
                              : "Free Plan"}
                          </div>{" "}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {userData?.plan_started_at && (
                            <div className="text-sm text-muted-foreground">
                              {userData?.plan_started_at
                                ? `Started: ${new Date(
                                    userData.plan_started_at
                                  ).toLocaleDateString()}`
                                : "Not started"}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        Active
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      {/* <div className="text-2xl font-bold">
                        ${userData?.price?.price || 0}
                      </div> */}
                      <div className="text-sm text-muted-foreground">
                        {userData?.plan_started_at
                          ? `Started: ${new Date(
                              userData.plan_started_at
                            ).toLocaleDateString()}`
                          : "Not started"}
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/pricing")}
                  >
                    <span className="mr-2">✨</span>
                    Upgrade Plan
                  </Button>
                  {userData?.is_plan_active && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "usage":
        return <UsageStats />;

      case "support":
        return <FeedbackForm />;

      default:
        return null;
    }
  };

  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-4xl h-[500px] p-0">
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[17rem] bg-muted/30 border-r p-4 space-y-1 flex-shrink-0 overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {userData?.name || "User"}
              </div>
              <div className="text-sm text-muted-foreground">
                {userData?.email || ""}
              </div>
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
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="mt-5 px-6 pb-4">
          {renderContent()}
        </div>
      </div>
    </div>
  </DialogContent>

  {showCancelDialog && (
    <CancelSubscriptionDialog
      isOpen={showCancelDialog}
      onClose={() => setShowCancelDialog(false)}
      userId={userData?.id || ""}
      userName={userData?.name || "User"}
      planName={
        userData?.plan_id === 1
          ? "Free Plan"
          : userData?.plan_id === 2
          ? "Pro Plan"
          : userData?.plan_id === 3
          ? "Enterprise Plan"
          : "Free Plan"
      }
      onConfirm={async (userId: string) => {
        try {
          const response = await cancelUserSubscription(userId);

          if (response?.success) {
            toast.success("Subscription cancelled successfully");
          } else {
            toast.error("Failed to cancel subscription");
          }
        } catch (error: any) {
          let errorMessage = "Error cancelling subscription";
          if (error?.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        } finally {
          setShowCancelDialog(false);
        }
      }}
    />
  )}
</Dialog>
  );
};

// Usage Stats Component
const UsageStats: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }));

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const loadUsageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUsageData(selectedMonth);
        if (!data) {
          setError("No usage data available for this month");
          setUsageData(null);
        } else {
          setUsageData(data);
        }
      } catch (error: any) {
        //console.error("Failed to load usage data:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load usage data";
        setError(errorMessage);
        setUsageData(null);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsageData();
  }, [selectedMonth]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">Usage Statistics</h3>
          <p className="text-muted-foreground text-sm">
            Track your token usage and credit consumption
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && usageData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(usageData.total_tokens || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {Math.round(usageData.avg_tokens_per_day || 0)}/day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(usageData.total_credits || 0).toFixed(3)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {(usageData.avg_credits_per_day || 0).toFixed(3)}/day
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usageData.active_days || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Usage Table */}
          <div>
            <h4 className="font-medium mb-3">Daily Usage</h4>
            {!usageData.daily_usage || usageData.daily_usage.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    No daily usage data available for {selectedMonth}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                      <TableHead className="text-right">
                        Credits Deducted
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageData.daily_usage.map((day, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {new Date(day.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {(day.tokens || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(day.credits || 0).toFixed(3)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
            
              }
          </div>
        </>
      )}

      {!error && !usageData && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              No usage data available for {selectedMonth}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Feedback Form Component
const FeedbackForm: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<FeedbackSubmission>({
    content: "",
    subject: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getFeedbackCategories();
        setCategories(response.categories);
      } catch (error) {
        //console.error("Failed to load categories:", error);
        toast.error("Failed to load feedback categories");
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!formData.category || !formData.subject || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback(formData);
      toast.success("Feedback submitted successfully!");
      setFormData({ content: "", subject: "", category: "" });
    } catch (error) {
      //console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FeedbackSubmission,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Report & Issue</h3>

        <p className="text-muted-foreground text-sm">
          Get help or share your thoughts with our team
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Brief description of your feedback"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Tell us more about your feedback..."
            className="bg-background min-h-[120px] resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
