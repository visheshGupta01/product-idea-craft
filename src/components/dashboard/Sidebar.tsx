import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';  
import { Separator } from '@/components/ui/separator';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfilePopup from './ProfilePopup';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, User, Moon, Sun, Github, Settings, Users, CreditCard, Lightbulb, Home, Link, Shield, MessageCircle, FolderOpen, ChevronDown } from 'lucide-react';
import SitemapSection from './SitemapSection';
import { ProjectDetails, ProjectFromAPI, fetchProjects } from '@/services/projectService';
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
  console.log("Sidebar: received projectDetails", projectDetails);
  const { user, isAuthenticated } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSection, setProfileSection] = useState('basic');
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isVercelConnected, setIsVercelConnected] = useState(false);
  const [projects, setProjects] = useState<ProjectFromAPI[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Check for existing dark mode preference and connection states
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    
    // GitHub and Vercel connections are now handled by their respective integration components
    // If projectDetails is available, you might update connection states based on it
    if (projectDetails) {
      // Example: setIsGitHubConnected(projectDetails.githubConnected);
      // Example: setIsVercelConnected(projectDetails.vercelConnected);
    }
  }, [projectDetails]);

  // Fetch user projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingProjects(true);
        const userProjects = await fetchProjects();
        setProjects(userProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [isAuthenticated]);
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
    // GitHub connection is now handled by GitHubIntegration component
    console.log("GitHub connection should be handled by the GitHub integration component");
  };

  const handleVercelConnect = () => {
    // Vercel connection is now handled by VercelIntegration component
    console.log("Vercel connection should be handled by the Vercel integration component");
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

        {/* Header - show expand button on collapsed main dashboard */}
        {activeView === 'main' && (
          <div className="p-2 border-b border-sidebar-border bg-sidebar-background flex justify-center">
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
                className="rotate-180"
              >
                <path d="m11 17-5-5 5-5" />
                <path d="m18 17-5-5 5-5" />
              </svg>
            </button>
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-foreground">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-56 bg-popover border border-border">
              <DropdownMenuItem onClick={() => {
                setProfileSection('basic');
                setProfileOpen(true);
              }}>
                <User className="mr-2 h-4 w-4" />
                User Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setProfileSection('integration');
                setProfileOpen(true);
              }}>
                <Settings className="mr-2 h-4 w-4" />
                Integration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setProfileSection('security');
                setProfileOpen(true);
              }}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setProfileSection('billing');
                setProfileOpen(true);
              }}>
                <CreditCard className="mr-2 h-4 w-4" />
                Credits & Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setProfileSection('support');
                setProfileOpen(true);
              }}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Support & Feedback
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

      {/* Header with Project Name */}
      {activeView === 'main' && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">
                {projectDetails?.title || currentProject.name}
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

      {/* My Projects Dropdown */}
      {activeView === 'main' && (
        <div className="px-4 py-2 border-b border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-8 px-2 text-left">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-sm">My Projects</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover border border-border">
              {loadingProjects ? (
                <DropdownMenuItem disabled>
                  Loading projects...
                </DropdownMenuItem>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <DropdownMenuItem 
                    key={project.session_id}
                    onClick={() => {
                      window.location.href = `/dashboard?sessionid=${project.session_id}`;
                    }}
                  >
                    <div className="flex flex-col space-y-1 w-full">
                      <span className="font-medium text-sm truncate">{project.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No projects found
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 transition-colors bg-sidebar-accent/50"
            >
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
          <DropdownMenuContent align="start" side="top" className="w-56 mb-2 bg-popover border border-border">
            <DropdownMenuItem onClick={() => {
              setProfileSection('basic');
              setProfileOpen(true);
            }}>
              <User className="mr-2 h-4 w-4" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setProfileSection('integration');
              setProfileOpen(true);
            }}>
              <Settings className="mr-2 h-4 w-4" />
              Integration
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setProfileSection('security');
              setProfileOpen(true);
            }}>
              <Shield className="mr-2 h-4 w-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setProfileSection('billing');
              setProfileOpen(true);
            }}>
              <CreditCard className="mr-2 h-4 w-4" />
              Credits & Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setProfileSection('support');
              setProfileOpen(true);
            }}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Support & Feedback
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

      <ProfilePopup 
        open={profileOpen} 
        onOpenChange={setProfileOpen} 
        initialSection={profileSection}
      />
    </div>
  );
};

export default Sidebar;
