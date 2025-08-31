import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';  
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, User, Moon, Sun, Database, Github, Settings, Users, CreditCard, Lightbulb, Home, Link } from 'lucide-react';
import SitemapSection from './SitemapSection';
import { ProjectDetails } from '@/services/projectService';
import myIcon from "../../assets/ImagineboIcon.svg";

type ActiveView = 'main' | 'team' | 'subscription' | 'my-projects' | 'user-profile';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentProject: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  activeView?: ActiveView;
  onViewChange?: (view: ActiveView) => void;
  projectDetails?: ProjectDetails;
}
const Sidebar = ({
  collapsed,
  onToggleCollapse,
  currentProject,
  activeView = 'main',
  onViewChange,
  projectDetails
}: SidebarProps) => {
  const { user, isAuthenticated } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isVercelConnected, setIsVercelConnected] = useState(false);

  // Check for existing dark mode preference and connection states
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    // Check GitHub connection
    const githubRepo = sessionStorage.getItem('github_repository');
    setIsGitHubConnected(!!githubRepo);
    
    // Check Vercel connection
    const vercelDeployment = sessionStorage.getItem('vercel_deployment');
    setIsVercelConnected(!!vercelDeployment);
  }, []);
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGitHubConnect = () => {
    if (isGitHubConnected) {
      // Already connected, show disconnect option or management
      sessionStorage.removeItem('github_repository');
      setIsGitHubConnected(false);
    } else {
      // Navigate to GitHub OAuth
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}&scope=repo,user`;
      window.location.href = githubAuthUrl;
    }
  };

  const handleVercelConnect = () => {
    if (isVercelConnected) {
      // Already connected, show disconnect option or management
      sessionStorage.removeItem('vercel_deployment');
      setIsVercelConnected(false);
    } else {
      // Navigate to Vercel OAuth  
      const vercelAuthUrl = `https://vercel.com/oauth/authorize?client_id=YOUR_VERCEL_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}&scope=read,write`;
      window.location.href = vercelAuthUrl;
    }
  };
  if (collapsed) {
    return <div className="w-16 h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col">
        {/* Home button at very top (only show when not on main) */}
        {activeView !== 'main' && (
          <div className="flex justify-center pt-2 pb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewChange?.('main')}>
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Back to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Header - only show hamburger on collapsed main dashboard */}
        {activeView === 'main' && (
          <div className="p-2 border-b border-sidebar-border bg-sidebar-background flex justify-center">
            <img
              src={myIcon}
              alt="Imaginebo"
              className="w-8 h-8"
            />
          </div>
        )}

        {/* Navigation icons - only show sitemap on main dashboard */}
        <div className="flex-1 flex flex-col bg-sidebar-background">
          {/* Sitemap Section - only show on main dashboard */}
          {activeView === 'main' && (
            <SitemapSection collapsed={true} projectDetails={projectDetails} />
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-2 border-t border-sidebar-border bg-sidebar flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                 <Avatar className="h-6 w-6">
                   <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-foreground">
                     {user?.firstName && user?.lastName 
                       ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                       : user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                   </AvatarFallback>
                 </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56">
              <DropdownMenuItem onClick={() => onViewChange?.('my-projects')}>
                <Lightbulb className="h-4 w-4 mr-2" />
                My Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange?.('user-profile')}>
                <User className="h-4 w-4 mr-2" />
                User Profile
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => onViewChange?.('team')}>
                <Users className="h-4 w-4 mr-2" />
                Teams
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onViewChange?.('subscription')}>
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings & Integrations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Connect to Supabase integration
                    console.log('Connect Supabase clicked');
                  }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Connect Supabase
                </Button>
                <Button 
                  variant={isGitHubConnected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={handleGitHubConnect}
                >
                  <Github className="h-4 w-4 mr-2" />
                  {isGitHubConnected ? 'Manage GitHub' : 'Connect GitHub'}
                </Button>
                <Button 
                  variant={isVercelConnected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={handleVercelConnect}
                >
                  <Link className="h-4 w-4 mr-2" />
                  {isVercelConnected ? 'Manage Vercel' : 'Connect Vercel'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>;
  }
  return (
    <div className="h-full w-full min-w-[240px] bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col">
      {/* Home button at very top (only show when not on main) */}
      {activeView !== 'main' && (
        <div className="p-2 bg-sidebar-background flex justify-center border-b border-sidebar-border">
          <Button variant="default" size="sm" className="h-8 w-8 p-0" onClick={() => onViewChange?.('main')}>
            <Home className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header with Logo and Project Name */}
      {activeView === 'main' && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <img
              src={myIcon}
              alt="Imaginebo"
              className="w-8 h-8"
            />
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">
                {projectDetails?.sitemap?.project_name || currentProject.name}
              </span>
            )}
          </div>
          
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </button>
        </div>
      )}

      {/* Sitemap Section - only show on main dashboard */}
      {activeView === 'main' && (
        <div className="flex-1 min-h-0 bg-sidebar-background">
          <SitemapSection collapsed={false} projectDetails={projectDetails} />
        </div>
      )}

      {/* Bottom Section - Always Visible */}
      <div className="p-2 border-sidebar-border space-y-2 flex-shrink-0 bg-sidebar-background">
        <Separator className="bg-sidebar-border" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 transition-colors bg-sidebar-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-sidebar-background text-sidebar-foreground">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || (isAuthenticated ? 'U' : <User className="h-4 w-4" />)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {isAuthenticated 
                      ? (user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user?.firstName || 'User')
                      : 'Guest'}
                  </p>
                </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => onViewChange?.('my-projects')}>
              <Lightbulb className="h-4 w-4 mr-2" />
              My Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange?.('user-profile')}>
              <User className="h-4 w-4 mr-2" />
              User Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onViewChange?.('team')}>
              <Users className="h-4 w-4 mr-2" />
              Teams
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => onViewChange?.('subscription')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings & Integrations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // Connect to Supabase integration
                console.log('Connect Supabase clicked');
              }}
            >
              <Database className="h-4 w-4 mr-2" />
              Connect Supabase
            </Button>
            <Button 
              variant={isGitHubConnected ? "default" : "outline"}
              className="w-full justify-start"
              onClick={handleGitHubConnect}
            >
              <Github className="h-4 w-4 mr-2" />
              {isGitHubConnected ? 'Manage GitHub' : 'Connect GitHub'}
            </Button>
            <Button 
              variant={isVercelConnected ? "default" : "outline"}
              className="w-full justify-start"
              onClick={handleVercelConnect}
            >
              <Link className="h-4 w-4 mr-2" />
              {isVercelConnected ? 'Manage Vercel' : 'Connect Vercel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
