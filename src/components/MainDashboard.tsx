
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Section - Task Tracker */}
        <div className="h-64 border-b border-border bg-card">
          <TaskTracker />
        </div>

        {/* Bottom Section - Chat and Preview */}
        <div className="flex flex-1 min-h-0">
          {/* AI Chat Panel */}
          <div className="w-80 min-w-0 border-r border-border bg-card hidden lg:block">
            <ChatPanel userIdea={userIdea} />
          </div>

          {/* Preview/Code Panel with 16:9 aspect ratio */}
          <div className="flex-1 min-w-0 border-r border-border flex flex-col">
            <PreviewCodePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
