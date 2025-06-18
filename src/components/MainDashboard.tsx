
import React, { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TeamPage from './dashboard/TeamPage';
import SubscriptionPage from './dashboard/SubscriptionPage';
import MyProjectsPage from './dashboard/MyProjectsPage';
import UserProfilePage from './dashboard/UserProfilePage';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface MainDashboardProps {
  userIdea: string;
  followUpAnswers: Record<string, string>;
}

type ActiveView = 'main' | 'team' | 'subscription' | 'my-projects' | 'user-profile';

const MainDashboard = ({ userIdea, followUpAnswers }: MainDashboardProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('main');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentProject] = useState({
    id: '1',
    name: 'My App Idea',
    description: userIdea,
    status: 'in-progress'
  });

  const renderMainContent = () => {
    switch (activeView) {
      case 'team':
        return (
          <div className="flex-1 h-full w-full">
            <TeamPage />
          </div>
        );
      case 'subscription':
        return (
          <div className="flex-1 h-full w-full">
            <SubscriptionPage />
          </div>
        );
      case 'my-projects':
        return (
          <div className="flex-1 h-full w-full">
            <MyProjectsPage />
          </div>
        );
      case 'user-profile':
        return (
          <div className="flex-1 h-full w-full">
            <UserProfilePage />
          </div>
        );
      default:
        return (
          <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
            {/* AI Chat Panel */}
            <ResizablePanel 
              defaultSize={sidebarCollapsed ? 35 : 30} 
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
              defaultSize={sidebarCollapsed ? 65 : 70} 
              minSize={50}
            >
              <div className="h-full">
                <PreviewCodePanel />
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
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
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
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
