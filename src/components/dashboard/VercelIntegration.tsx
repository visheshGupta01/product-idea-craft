import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Rocket,
  Globe,
  Github
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface DeploymentInfo {
  url: string;
  deployedAt: string;
  status: 'deployed' | 'deploying' | 'failed';
}

const VercelIntegration = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);
  const [hasGitHubRepo, setHasGitHubRepo] = useState(false);
    const { sessionId } = useUser();



  useEffect(() => {
    // Check if GitHub repository exists in chat session
    if (sessionId) {
      const savedSession = sessionStorage.getItem(`chat_session_${sessionId}`);
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          const githubUrl = session.githubUrl;
          setHasGitHubRepo(!!githubUrl);
        } catch (error) {
          console.error("Error parsing chat session:", error);
          // Fallback to old format
          const savedRepo = sessionStorage.getItem("github_repository");
          setHasGitHubRepo(!!savedRepo);
        }
      } else {
        // Fallback to old format
        const savedRepo = sessionStorage.getItem("github_repository");
        setHasGitHubRepo(!!savedRepo);
      }
    } else {
      // Fallback to old format
      const savedRepo = sessionStorage.getItem("github_repository");
      setHasGitHubRepo(!!savedRepo);
    }

    // Check if deployment info exists
    const savedDeployment = sessionStorage.getItem("vercel_deployment");
    if (savedDeployment) {
      try {
        const deploymentInfo = JSON.parse(savedDeployment);
        setDeployment(deploymentInfo);
      } catch (error) {
        console.error("Error parsing saved deployment:", error);
      }
    }

    // Check for Vercel callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const action = urlParams.get("action");
    const deployUrl = urlParams.get("url");

    if (action === "vercel-deploy" && success === "true" && deployUrl) {
      handleDeploymentSuccess(deployUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [sessionId]);

    const handleDeploymentSuccess = (deployUrl: string) => {
    const deploymentInfo: DeploymentInfo = {
      url: deployUrl,
      deployedAt: new Date().toISOString(),
      status: 'deployed'
    };
    setDeployment(deploymentInfo);
    setIsDeploying(false);
    sessionStorage.setItem('vercel_deployment', JSON.stringify(deploymentInfo));
    toast.success('Successfully deployed to Vercel!');
  };

  const handleDeployToVercel = async () => {
    if (!sessionId) {
      toast.error("Please ensure you have an active session");
      return;
    }

    if (!hasGitHubRepo) {
      toast.error("Please connect to GitHub first");
      return;
    }

    setIsDeploying(true);
    try {
      // Redirect to Vercel OAuth with deployment flow
      const vercelUrl = `http://54.166.141.144:8000/vercel/auth/?sessionid=${sessionId}`;
      window.location.href = vercelUrl;
    } catch (error) {
      console.error("Error deploying to Vercel:", error);
      toast.error("Failed to deploy to Vercel");
      setIsDeploying(false);
    }
  };

  const handleRedeploy = () => {
    if (deployment) {
      setDeployment({ ...deployment, status: 'deploying' });
      handleDeployToVercel();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Deployed
          </Badge>
        );
      case 'deploying':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Deploying
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-black rounded-md">
                <span className="text-white font-bold text-sm">▲</span>
              </div>
              <CardTitle>Vercel Deployment</CardTitle>
            </div>
          </div>
          {deployment && getStatusBadge(deployment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasGitHubRepo ? (
          <div className="text-center py-8">
            <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">GitHub Required</h3>
            <p className="text-muted-foreground mb-6">
              Connect to GitHub first to deploy your project to Vercel.
            </p>
            <Button variant="outline" disabled>
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub First
            </Button>
          </div>
        ) : !deployment ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Deploy to Vercel</h3>
              <p className="text-muted-foreground mb-6">
                Deploy your GitHub repository to Vercel for live hosting with automatic builds.
              </p>
              <Button 
                onClick={handleDeployToVercel}
                disabled={isDeploying}
                className="flex items-center space-x-2"
              >
                {isDeploying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="h-4 w-4" />
                )}
                <span>{isDeploying ? 'Deploying...' : 'Deploy to Vercel'}</span>
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                What happens when you deploy?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your GitHub repository will be connected to Vercel</li>
                <li>• Automatic builds triggered on every push</li>
                <li>• Live URL generated for your application</li>
                <li>• SSL certificate automatically configured</li>
                <li>• Global CDN for fast loading worldwide</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Live Application</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deployed on {formatDate(deployment.deployedAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(deployment.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Live
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedeploy}
                  disabled={deployment.status === 'deploying'}
                >
                  {deployment.status === 'deploying' ? (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  ) : (
                    <Rocket className="h-3 w-3 mr-2" />
                  )}
                  Redeploy
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Deployment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL:</span>
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {deployment.url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(deployment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <span>Vercel</span>
                </div>
              </div>
            </div>

            {deployment.status === 'deployed' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">
                  🚀 Your app is live!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your application is successfully deployed and accessible worldwide. Any future pushes to your GitHub repository will automatically trigger new deployments.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VercelIntegration;