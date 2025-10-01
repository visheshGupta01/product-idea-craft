import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { createStripeSession } from '@/services/paymentService';
import { toast } from 'sonner';
import Navbar from '@/components/landing_page/Navbar';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      subtitle: 'Starter',
      price: '0',
      credits: '5 prompts/month',
      features: [
        'Basic prompt-to-build flow',
        'Public projects only',
        'Limited AI generations',
        'Watermarked "Built with imagine.bo"',
        'Community support',
      ],
      popular: false,
      planId: 1,
    },
    {
      name: 'Pro',
      subtitle: 'Creator',
      price: '25',
      credits: '2500 credits/month',
      features: [
        'Custom domains',
        'Remove imagine.bo badge',
        'Private projects',
        '10GB storage',
        'Rollover enabled',
        'SDE support in 24 hrs',
      ],
      popular: true,
      planId: 2,
    },
  ];

  const handleSelectPlan = async (planName: string, price: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue');
      navigate('/?action=login');
      return;
    }

    if (planName === 'Free') {
      toast.info('You are already on the Free plan');
      return;
    }

    setLoadingPlan(planName);

    try {
      await createStripeSession({
        userUUID: user?.id || '',
        price: price,
        plan_name: planName,
        credits: planName === 'Pro' ? 2500 : 0,
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start building for free, upgrade when you need more power
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="space-y-1">
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.subtitle}
                  </CardDescription>
                </div>
                <div className="mt-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm font-medium text-primary mt-2">
                  {plan.credits}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.name, plan.price)}
                  disabled={loadingPlan === plan.name || plan.name === 'Free'}
                >
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.name === 'Free' ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>All plans include secure payments via Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
