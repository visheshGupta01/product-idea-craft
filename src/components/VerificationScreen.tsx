
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Github, Database, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  optional?: boolean;
}

interface VerificationScreenProps {
  onComplete: () => void;
}

const VerificationScreen = ({ onComplete }: VerificationScreenProps) => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      connected: false
    },
    {
      id: 'supabase',
      name: 'Supabase',
      icon: <Database className="h-5 w-5" />,
      connected: false
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: <Globe className="h-5 w-5" />,
      connected: false,
      optional: true
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: <Globe className="h-5 w-5" />,
      connected: false,
      optional: true
    }
  ]);

  const [showDeploymentOptions, setShowDeploymentOptions] = useState(false);

  const handleConnect = (integrationId: string) => {
    // Simulate connection - in real app, this would trigger actual integration
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, connected: true }
          : integration
      )
    );
  };

  const requiredIntegrations = integrations.filter(i => !i.optional);
  const optionalIntegrations = integrations.filter(i => i.optional);
  const allRequiredConnected = requiredIntegrations.every(i => i.connected);
  const hasDeploymentOption = optionalIntegrations.some(i => i.connected);

  const canProceed = allRequiredConnected && hasDeploymentOption;

  const handleDeploymentChoice = () => {
    setShowDeploymentOptions(true);
  };

  const handleSelectDeployment = (deploymentId: string) => {
    // Connect the selected deployment option and disconnect the other
    setIntegrations(prev => 
      prev.map(integration => {
        if (integration.optional) {
          return {
            ...integration,
            connected: integration.id === deploymentId
          };
        }
        return integration;
      })
    );
    setShowDeploymentOptions(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Setup</CardTitle>
          <CardDescription>
            Connect these integrations to unlock the full power of your development environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Required Integrations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Required Integrations
              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
            </h3>
            <div className="space-y-3">
              {requiredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {integration.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    {integration.icon}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {integration.connected ? 'Connected successfully' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {!integration.connected && (
                    <Button
                      onClick={() => handleConnect(integration.id)}
                      variant="outline"
                      size="sm"
                    >
                      Connect
                    </Button>
                  )}
                  {integration.connected && (
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      ✓ Connected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Choose Deployment Platform
              <Badge variant="secondary" className="ml-2 text-xs">Choose One</Badge>
            </h3>
            
            {!hasDeploymentOption ? (
              <div className="p-4 border rounded-lg bg-accent/20">
                <p className="text-sm text-muted-foreground mb-3">
                  Select your preferred deployment platform to host your application
                </p>
                <Button
                  onClick={handleDeploymentChoice}
                  variant="outline"
                  className="w-full"
                  disabled={!allRequiredConnected}
                >
                  Choose Deployment Platform
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {optionalIntegrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      integration.connected ? 'bg-green-50 border-green-200' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {integration.connected ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      {integration.icon}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.connected ? 'Selected for deployment' : 'Available option'}
                        </p>
                      </div>
                    </div>
                    {integration.connected && (
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        ✓ Selected
                      </Badge>
                    )}
                  </div>
                ))}
                <Button
                  onClick={handleDeploymentChoice}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Change Selection
                </Button>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={onComplete}
              disabled={!canProceed}
              className="w-full"
              size="lg"
            >
              {canProceed ? 'Continue to Dashboard' : 'Complete All Integrations'}
            </Button>
            {!canProceed && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Please connect all required integrations and choose a deployment platform
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Selection Dialog */}
      <Dialog open={showDeploymentOptions} onOpenChange={setShowDeploymentOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Deployment Platform</DialogTitle>
            <DialogDescription>
              Select where you'd like to deploy and host your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {optionalIntegrations.map((integration) => (
              <Button
                key={integration.id}
                onClick={() => handleSelectDeployment(integration.id)}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <div className="flex items-center space-x-3">
                  {integration.icon}
                  <div className="text-left">
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {integration.id === 'vercel' 
                        ? 'Perfect for React apps with automatic deployments'
                        : 'Simple static site hosting with continuous deployment'
                      }
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerificationScreen;
