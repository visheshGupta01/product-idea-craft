
import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TeamPage from './dashboard/TeamPage';
import SubscriptionPage from './dashboard/SubscriptionPage';

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
          <div className="flex-1 min-w-0">
            <TeamPage />
          </div>
        );
      case 'subscription':
        return (
          <div className="flex-1 min-w-0">
            <SubscriptionPage />
          </div>
        );
      default:
        return (
          <div className="flex-1 flex min-w-0 overflow-hidden">
            {/* AI Chat Panel */}
            <div className="w-80 min-w-0 border-r border-border bg-card hidden lg:block">
              <ChatPanel userIdea={userIdea} />
            </div>

            {/* Preview/Code Panel */}
            <div className="flex-1 min-w-0">
              <PreviewCodePanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar with Tasks */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentProject={currentProject}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Area */}
      {renderMainContent()}
    </div>
  );
};

export default MainDashboard;
