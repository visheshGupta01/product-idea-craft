
import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TeamPage from './dashboard/TeamPage';
import SubscriptionPage from './dashboard/SubscriptionPage';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface MainDashboardProps {
  userIdea: string;
  followUpAnswers: Record<string, string>;
}

type ActiveView = 'main' | 'team' | 'subscription';

const MainDashboard = ({ userIdea, followUpAnswers }: MainDashboardProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('main');
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
      default:
        return (
          <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
            {/* AI Chat Panel */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="hidden lg:block">
              <div className="h-full border-r border-border bg-card">
                <ChatPanel userIdea={userIdea} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden lg:flex" />

            {/* Preview/Code Panel */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="h-full">
                <PreviewCodePanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar */}
        <ResizablePanel 
          defaultSize={20} 
          minSize={4} 
          maxSize={35}
          collapsible={true}
          onCollapse={() => handleSidebarCollapse(true)}
          onExpand={() => handleSidebarCollapse(false)}
        >
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentProject={currentProject}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content Area */}
        <ResizablePanel defaultSize={80} minSize={65}>
          {renderMainContent()}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainDashboard;
