
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

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar - only collapsible for main view */}
        {activeView === 'main' ? (
          <>
            <ResizablePanel 
              defaultSize={20} 
              minSize={4} 
              maxSize={35}
              collapsible={true}
              onCollapse={() => setSidebarCollapsed(true)}
              onExpand={() => setSidebarCollapsed(false)}
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
          </>
        ) : (
          <>
            {/* Non-collapsible sidebar for team and subscription views */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
              <Sidebar 
                collapsed={false}
                onToggleCollapse={() => {}}
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
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default MainDashboard;
