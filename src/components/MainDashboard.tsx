
import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import ChatPanel from './dashboard/ChatPanel';
import PreviewCodePanel from './dashboard/PreviewCodePanel';
import TaskTracker from './dashboard/TaskTracker';

interface MainDashboardProps {
  userIdea: string;
}

const MainDashboard = ({ userIdea }: MainDashboardProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentProject] = useState({
    id: '1',
    name: 'My App Idea',
    description: userIdea,
    status: 'in-progress'
  });

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentProject={currentProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* AI Chat Panel */}
        <div className="w-80 min-w-0 border-r border-border bg-card hidden lg:block">
          <ChatPanel userIdea={userIdea} />
        </div>

        {/* Preview/Code Panel */}
        <div className="flex-1 min-w-0 border-r border-border">
          <PreviewCodePanel />
        </div>

        {/* Task Tracker Panel */}
        <div className="w-80 min-w-0 bg-card xl:block">
          <TaskTracker />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
