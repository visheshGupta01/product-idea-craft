import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getInitialsFromNames } from "@/lib/avatarUtils";
import { Link as RouterLink } from "react-router-dom";
import ImagineboIcon from "../../assets/ImagineboIcon.svg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfilePopup from "./ProfilePopup";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  Moon,
  Sun,
  Github,
  Settings,
  Users,
  CreditCard,
  Lightbulb,
  Home,
  Link,
  Shield,
  MessageCircle,
  FolderOpen,
  ChevronDown,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SitemapSection from "./SitemapSection";
import {
  ProjectDetails,
  ProjectFromAPI,
  fetchProjects,
  renameProject,
} from "@/services/projectService";
import { inboxService } from "@/services/inboxService";
import { useNavigate } from "react-router-dom";
import { FileNode } from "./FileExplorer";

type ActiveView = "main" | "team" | "my-projects";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  clickedFile?: string;
  currentProject: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  activeView?: ActiveView;
  onViewChange?: (view: ActiveView) => void;
  projectDetails?: ProjectDetails;
  sessionId?: string;
  onProjectRenamed?: (newTitle: string) => void;
  setSelectedPage?: (page: FileNode | null) => void;
}
const Sidebar = ({
  collapsed,
  onToggleCollapse,
  currentProject,
  activeView = "main",
  onViewChange,
  projectDetails,
  sessionId,
  onProjectRenamed,
  setSelectedPage
}: SidebarProps) => {
  //console.log("Sidebar: received projectDetails", projectDetails);
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSection, setProfileSection] = useState("basic");
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isVercelConnected, setIsVercelConnected] = useState(false);
  const [projects, setProjects] = useState<ProjectFromAPI[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch user projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingProjects(true);
        const userProjects = await fetchProjects();
        setProjects(userProjects);
      } catch (error) {
        //console.error("Failed to fetch projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchInbox = async () => {  
      if (!isAuthenticated) return;

      try {
        const inboxData = await inboxService.getUserInbox();
        const count = inboxData.tasks.reduce(
          (acc, task) => acc + task.assigner_unread_count,
          0
        );
        setUnreadCount(count);
      } catch (error) {
        //console.error("Failed to fetch inbox:", error);
      }
    };

    fetchInbox();
    const interval = setInterval(fetchInbox, 60000); // Refetch every 60 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleGitHubConnect = () => {
    // GitHub connection is now handled by GitHubIntegration component
    //console.log("GitHub connection should be handled by the GitHub integration component");
  };

  const handleVercelConnect = () => {
    // Vercel connection is now handled by VercelIntegration component
    //console.log("Vercel connection should be handled by the Vercel integration component");
  };

  const handleRenameClick = () => {
    setNewProjectName(projectDetails?.title || currentProject.name);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!newProjectName.trim() || !sessionId) return;

    try {
      const result = await renameProject(sessionId, newProjectName.trim());
      if (result.success) {
        toast({
          title: "Project renamed successfully",
          description: `Project name changed to "${newProjectName}"`,
        });
        onProjectRenamed?.(newProjectName.trim());
        setRenameDialogOpen(false);
      } else {
        toast({
          title: "Rename failed",
          description: result.message || "Failed to rename project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename project. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      {collapsed ? (
        <div className="w-16 h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col">
          {/* Logo Navbar */}
          <div className="h-14 flex items-center justify-center border-b border-[#2A2A2A] bg-[#1A1A1A]">
            <RouterLink to="/">
              <img
                alt="Imagine.bo Logo"
                src={ImagineboIcon}
                className="w-8 h-8 object-contain"
              />
            </RouterLink>
          </div>
          
          {/* Home button at very top (only show when not on main) */}
          {activeView !== "main" && (
            <div className="flex justify-center pt-2 pb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onViewChange?.("main")}
                    >
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
          {activeView === "main" && (
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
            {activeView === "main" && (
              <SitemapSection collapsed={true} projectDetails={projectDetails} setSelectedPage={setSelectedPage}/>
            )}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto p-2 border-t border-sidebar-border bg-sidebar flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-foreground">
                      {getInitialsFromNames(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="right"
                className="w-56 bg-popover border border-border z-50"
              >
                <DropdownMenuItem onClick={() => onViewChange?.("my-projects")}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  My Projects
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("basic");
                    setProfileOpen(true);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  User Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("billing");
                    setProfileOpen(true);
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credits & Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("support");
                    setProfileOpen(true);
                  }}
                >
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
                    {isGitHubConnected ? "Manage GitHub" : "Connect GitHub"}
                  </Button>
                  <Button
                    variant={isVercelConnected ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={handleVercelConnect}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    {isVercelConnected ? "Manage Vercel" : "Connect Vercel"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="h-full w-full min-w-[240px] bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col">
          {/* Home button at very top (only show when not on main) */}
          {activeView !== "main" && (
            <div className="p-2 bg-sidebar-background flex justify-center border-b border-sidebar-border">
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onViewChange?.("main")}
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Header with Project Name */}
          {activeView === "main" && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                {!collapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span className="text-lg font-semibold text-sidebar-foreground cursor-pointer hover:text-sidebar-foreground/80 transition-colors flex items-center gap-2">
                        {projectDetails?.title || currentProject.name}
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={handleRenameClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  className={`transition-transform ${
                    collapsed ? "rotate-180" : ""
                  }`}
                >
                  <path d="m11 17-5-5 5-5" />
                  <path d="m18 17-5-5 5-5" />
                </svg>
              </button>
            </div>
          )}

          {/* Sitemap Section - only show on main dashboard */}
          {activeView === "main" && (
            <div className="flex-1 min-h-0 overflow-y-auto bg-sidebar-background">
              <SitemapSection collapsed={false} projectDetails={projectDetails} setSelectedPage={setSelectedPage}/>
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
                      {getInitialsFromNames(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {isAuthenticated
                        ? user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.firstName || "User"
                        : "Guest"}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-56 mb-2 bg-popover border border-border z-50"
              >
                <DropdownMenuItem onClick={() => onViewChange?.("my-projects")}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  My Projects
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("basic");
                    setProfileOpen(true);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/inbox")}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Inbox
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("billing");
                    setProfileOpen(true);
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credits & Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setProfileSection("support");
                    setProfileOpen(true);
                  }}
                >
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
                  {isGitHubConnected ? "Manage GitHub" : "Connect GitHub"}
                </Button>
                <Button
                  variant={isVercelConnected ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={handleVercelConnect}
                >
                  <Link className="h-4 w-4 mr-2" />
                  {isVercelConnected ? "Manage Vercel" : "Connect Vercel"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Rename Project Dialog */}
          <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter new project name"
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit();
                    }
                  }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setRenameDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRenameSubmit}
                    disabled={!newProjectName.trim()}
                  >
                    Rename
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* ProfilePopup - rendered outside both collapsed and expanded views */}
      <ProfilePopup
        open={profileOpen}
        onOpenChange={setProfileOpen}
        initialSection={profileSection}
      />
    </>
  );
};

export default Sidebar;
