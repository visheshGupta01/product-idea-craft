import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TeamPage from './dashboard/TeamPage';
import SubscriptionPage from './dashboard/SubscriptionPage';
import MyProjectsPage from './dashboard/MyProjectsPage';
import UserProfilePage from './dashboard/UserProfilePage';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import IDE from './dashboard/FileExplorerAndCoder';

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

  const handleLogout = () => {
    // Navigate back to the idea submission screen
    window.location.href = '/';
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
        return (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-w-0"
          >
            {/* AI Chat Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 40 : 35}
              minSize={25}
              maxSize={50}
              className="hidden lg:block"
            >
              <div className="h-full border-r border-border bg-card">
                <ChatPanel userIdea={userIdea} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden lg:flex" />

            {/* Preview/Code Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 60 : 65}
              minSize={50}
            >
              <div className="h-full">
                <IDE />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
