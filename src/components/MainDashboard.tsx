
import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TeamPage from './dashboard/TeamPage';
import SubscriptionPage from './dashboard/SubscriptionPage';
import MyProjectsPage from './dashboard/MyProjectsPage';
import UserProfilePage from './dashboard/UserProfilePage';
import Navbar from './ui/navbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useUser } from '@/context/UserContext';
import { fetchProjectDetails, ProjectDetails } from '@/services/projectService';

interface MainDashboardProps {
  userIdea: string;
  sessionId?: string;
  deployUrl?: string;
  shouldOpenPreview?: boolean;
}

type ActiveView = 'main' | 'team' | 'subscription' | 'my-projects' | 'user-profile';

const MainDashboard = ({ userIdea, sessionId, deployUrl, shouldOpenPreview }: MainDashboardProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentProject] = useState({
    id: '1',
    name: 'My App Idea',
    description: userIdea,
    status: 'in-progress'
  });
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | undefined>();

  const { initialResponse } = useUser();

  // Track if frontend creation task is completed (task id 6: "First Draft Generated")
  const [isFrontendCreated, setIsFrontendCreated] = useState(shouldOpenPreview || false);
  const [previewUrl, setPreviewUrl] = useState<string>(deployUrl || '');

  // Fetch project details when sessionId changes
  useEffect(() => {
    const loadProjectDetails = async () => {
      if (sessionId) {
        try {
          console.log('📝 Fetching project details for sessionId:', sessionId);
          const details = await fetchProjectDetails(sessionId);
          console.log('📝 Project details fetched:', details);
          setProjectDetails(details);
          
          // Auto-open preview if project_url is available
          if (details.project_url) {
            setPreviewUrl(details.project_url);
            setIsFrontendCreated(true);
            console.log("🎯 Auto-opening preview with URL:", details.project_url);
          }
        } catch (error) {
          console.error('📝 Failed to fetch project details:', error);
        }
      } else {
        setProjectDetails(undefined);
      }
    };

    loadProjectDetails();
  }, [sessionId]);

  // Listen for sitemap updates via WebSocket
  useEffect(() => {
    if (!sessionId) return;

    const handleSitemapUpdate = (event: CustomEvent) => {
      console.log('📝 Sitemap updated:', event.detail);
      // Refetch project details to get updated sitemap
      fetchProjectDetails(sessionId)
        .then(details => {
          setProjectDetails(details);
          console.log('📝 Project details refreshed after sitemap update');
        })
        .catch(error => console.error('📝 Failed to refresh project details:', error));
    };

    const handleProjectUrlUpdate = (event: CustomEvent) => {
      console.log('🎯 Project URL updated:', event.detail);
      if (event.detail.project_url) {
        setPreviewUrl(event.detail.project_url);
        setIsFrontendCreated(true);
        console.log("🎯 Auto-opening preview with updated URL:", event.detail.project_url);
      }
    };

    window.addEventListener('sitemapUpdate', handleSitemapUpdate as EventListener);
    window.addEventListener('projectUrlUpdate', handleProjectUrlUpdate as EventListener);
    
    return () => {
      window.removeEventListener('sitemapUpdate', handleSitemapUpdate as EventListener);
      window.removeEventListener('projectUrlUpdate', handleProjectUrlUpdate as EventListener);
    };
  }, [sessionId]);

  // Auto-collapse sidebar on non-main screens
  useEffect(() => {
    if (activeView !== 'main') {
      setSidebarCollapsed(true);
    }
  }, [activeView]);

  useEffect(() => {
    const handleFrontendComplete = () => {
      setIsFrontendCreated(true);
    };

    window.addEventListener('frontendComplete', handleFrontendComplete);
    return () => window.removeEventListener('frontendComplete', handleFrontendComplete);
  }, []);

  const handleFrontendGenerated = (url: string) => {
    setPreviewUrl(url);
    setIsFrontendCreated(true);
    console.log("🎯 Preview URL set:", url);
  };

  const handleLogout = () => {
    // Navigate back to the idea submission screen
    window.location.href = '/';
  };

  const handlePublish = () => {
    // Handle publish functionality
    console.log('Publishing app...');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'team':
       return <TeamPage />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'my-projects':
        return <MyProjectsPage />;
      case 'user-profile':
        return <UserProfilePage onLogout={handleLogout} />;
      default:
        // Show fullscreen chat if we have initial MCP response but frontend isn't created
        // OR if we don't have initial response (fallback to original behavior)
        // But skip if we should open preview (deployed project)
        if ((!isFrontendCreated || initialResponse) && !shouldOpenPreview) {
          return (
            <div className="h-full">
              <ChatPanel userIdea={userIdea} onFrontendGenerated={handleFrontendGenerated} sessionId={sessionId} />
            </div>
          );
        }
        
        // Show normal layout after frontend creation and initial response is processed
        return (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-w-0"
          >
            {/* AI Chat Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 40 : 35}
              minSize={25}
              maxSize={75}
              className="hidden lg:block"
            >
              <div className="h-full border-r border-border">
                <ChatPanel userIdea={userIdea} onFrontendGenerated={handleFrontendGenerated} sessionId={sessionId} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden lg:flex" />

            {/* Preview/Code Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 60 : 65}
              minSize={0}
              collapsible={true}
            >
              <div className="h-full bg-background">
                <PreviewCodePanel previewUrl={previewUrl} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Fixed Navbar - only show on main dashboard */}
      <Navbar onPublish={handlePublish} isFrontendCreated={isFrontendCreated} />

      {/* Main content with conditional top padding for navbar */}
      <div className="h-full pt-14 flex">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } flex-shrink-0`}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              // Only allow toggle on main dashboard, keep collapsed on other screens
              if (activeView === "main") {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            currentProject={currentProject}
            activeView={activeView}
            onViewChange={setActiveView}
            projectDetails={projectDetails}
          />
        </div>

        {/* Main Content Area - takes remaining space */}
        <div className="flex-1 min-w-0">{renderActiveView()}</div>
      </div>
    </div>
  );
};

export default MainDashboard;
