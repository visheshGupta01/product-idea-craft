import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Github,
  ExternalLink,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface GitHubRepo {
  name: string;
  clone_url: string;
  html_url: string;
  created_at: string;
}

const GitHubIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [repository, setRepository] = useState<GitHubRepo | null>(null);
  const { sessionId } = useUser();

  useEffect(() => {
    // Check if we have GitHub repository info in localStorage
    const savedRepo = localStorage.getItem('github_repository');
    if (savedRepo) {
      try {
        const repo = JSON.parse(savedRepo);
        setRepository(repo);
        setIsConnected(true);
      } catch (error) {
        console.error('Error parsing saved repository:', error);
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const cloneUrl = urlParams.get('clone_url');
    
    if (status === 'success' && cloneUrl) {
      handleOAuthSuccess(cloneUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOAuthSuccess = (cloneUrl: string) => {
    // Extract repository info from clone URL
    const repoName = cloneUrl.split('/').pop()?.replace('.git', '') || 'Unknown';
    const htmlUrl = cloneUrl.replace('.git', '');
    
    const repo: GitHubRepo = {
      name: repoName,
      clone_url: cloneUrl,
      html_url: htmlUrl,
      created_at: new Date().toISOString()
    };

    setRepository(repo);
    setIsConnected(true);
    localStorage.setItem('github_repository', JSON.stringify(repo));
    toast.success('Successfully connected to GitHub!');
  };

  const handleConnectGitHub = async () => {
    if (!sessionId) {
      toast.error('Please ensure you have an active session');
      return;
    }

    setIsConnecting(true);
    try {
      // Redirect to GitHub OAuth
      const githubUrl = `http://localhost:8000/github/?sessionid=${sessionId}`;
      window.location.href = githubUrl;
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRepository(null);
    localStorage.removeItem('github_repository');
    toast.success('Disconnected from GitHub');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Github className="h-5 w-5" />
            <CardTitle>GitHub Integration</CardTitle>
          </div>
          {isConnected && (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Github className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect to GitHub</h3>
              <p className="text-muted-foreground mb-6">
                Sync your projects with GitHub repositories for version control and collaboration.
              </p>
              <Button 
                onClick={handleConnectGitHub}
                disabled={isConnecting}
                className="flex items-center space-x-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                <span>{isConnecting ? 'Connecting...' : 'Connect to GitHub'}</span>
              </Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                What happens when you connect?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A new repository will be created for your project</li>
                <li>• Your generated code will be automatically pushed</li>
                <li>• Future updates will sync with your repository</li>
                <li>• You can collaborate with others through GitHub</li>
              </ul>
            </div>
          </div>
        ) : (
          repository && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{repository.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(repository.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(repository.html_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View on GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Repository Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clone URL:</span>
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      {repository.clone_url}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">
                  🎉 Ready to collaborate!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your project is now synced with GitHub. Any changes made to your code will be automatically pushed to your repository.
                </p>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubIntegration;