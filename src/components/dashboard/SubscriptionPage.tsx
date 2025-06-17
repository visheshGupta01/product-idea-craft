
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Check, 
  Star, 
  Zap, 
  Users, 
  Database, 
  Download,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

const SubscriptionPage = () => {
  const currentPlan = {
    name: 'Pro Plan',
    price: '$29',
    billing: 'monthly',
    status: 'active',
    nextBilling: '2024-07-17',
    daysLeft: 12
  };

  const usage = {
    projects: { current: 8, limit: 15 },
    storage: { current: 2.4, limit: 10 }, // GB
    teamMembers: { current: 3, limit: 10 },
    deployments: { current: 45, limit: 100 }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      billing: 'forever',
      features: [
        '3 Projects',
        '1GB Storage',
        '1 Team Member',
        '10 Deployments/month',
        'Community Support'
      ],
      current: false,
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      billing: 'per month',
      features: [
        '15 Projects',
        '10GB Storage',
        '10 Team Members',
        '100 Deployments/month',
        'Priority Support',
        'Custom Domains',
        'Advanced Analytics'
      ],
      current: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      billing: 'per month',
      features: [
        'Unlimited Projects',
        '100GB Storage',
        'Unlimited Team Members',
        'Unlimited Deployments',
        '24/7 Support',
        'Custom Domains',
        'Advanced Analytics',
        'SSO Integration',
        'Custom Integrations'
      ],
      current: false,
      popular: false
    }
  ];

  const getUsagePercentage = (current: number, limit: number) => {
    return (current / limit) * 100;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
              <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Star className="h-3 w-3 mr-1" />
            {currentPlan.name}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{currentPlan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan.price}/{currentPlan.billing}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Active
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="font-medium">{currentPlan.nextBilling}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Days remaining</span>
                  <span className="font-medium">{currentPlan.daysLeft} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Information</CardTitle>
              <CardDescription>Payment method and billing history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Overview</CardTitle>
            <CardDescription>Current usage across your plan limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Projects</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.projects.current}/{usage.projects.limit}
                  </span>
                </div>
                <Progress value={getUsagePercentage(usage.projects.current, usage.projects.limit)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.storage.current}GB/{usage.storage.limit}GB
                  </span>
                </div>
                <Progress value={getUsagePercentage(usage.storage.current, usage.storage.limit)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Team Members</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.teamMembers.current}/{usage.teamMembers.limit}
                  </span>
                </div>
                <Progress value={getUsagePercentage(usage.teamMembers.current, usage.teamMembers.limit)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deployments</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.deployments.current}/{usage.deployments.limit}
                  </span>
                </div>
                <Progress value={getUsagePercentage(usage.deployments.current, usage.deployments.limit)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Plans</CardTitle>
            <CardDescription>Choose the plan that best fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-4 rounded-lg border-2 transition-colors ${
                    plan.current
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/{plan.billing}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={plan.current ? "outline" : "default"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                      {!plan.current && <ArrowUpRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
