
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

interface MainDashboardProps {
  userIdea: string;
}

type ActiveView = 'main' | 'team' | 'subscription' | 'my-projects' | 'user-profile';

const MainDashboard = ({ userIdea }: MainDashboardProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentProject] = useState({
    id: '1',
    name: 'My App Idea',
    description: userIdea,
    status: 'in-progress'
  });

  const { initialResponse } = useUser();

  // Track if frontend creation task is completed (task id 6: "First Draft Generated")
  const [isFrontendCreated, setIsFrontendCreated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
        if (!isFrontendCreated || initialResponse) {
          return (
            <div className="h-full">
              <ChatPanel userIdea={userIdea} onFrontendGenerated={handleFrontendGenerated} />
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
                <ChatPanel userIdea={userIdea} onFrontendGenerated={handleFrontendGenerated} />
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
      {/* Fixed Navbar */}
      <Navbar onPublish={handlePublish} isFrontendCreated={isFrontendCreated} />
      
      {/* Main content with top padding for navbar */}
      <div className="h-full pt-14 flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              // Only allow toggle on main dashboard, keep collapsed on other screens
              if (activeView === 'main') {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            currentProject={currentProject}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {/* Main Content Area - takes remaining space */}
        <div className="flex-1 min-w-0">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
