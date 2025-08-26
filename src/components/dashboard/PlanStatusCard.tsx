import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { Calendar, Crown, User } from 'lucide-react';

const PlanStatusCard = () => {
  const { userPlan } = useUser();

  if (!userPlan) {
    return null;
  }

  const getPlanIcon = (planId: number) => {
    switch (planId) {
      case 1:
        return <User className="w-4 h-4" />;
      case 2:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 3:
        return <Crown className="w-4 h-4 text-purple-500" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planId: number) => {
    switch (planId) {
      case 1:
        return 'bg-gray-100 text-gray-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getPlanIcon(userPlan.planId)}
          Current Plan
        </CardTitle>
        <CardDescription>Your subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Plan:</span>
          <Badge className={getPlanColor(userPlan.planId)}>
            {userPlan.planName}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={userPlan.isActive ? "default" : "secondary"}>
            {userPlan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {userPlan.expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Expires:
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(userPlan.expiresAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanStatusCard;