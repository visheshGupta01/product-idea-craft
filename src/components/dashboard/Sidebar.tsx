
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Plus, 
  FolderOpen, 
  User, 
  Moon, 
  Sun, 
  Database, 
  Github,
  Settings,
  Bell
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentProject: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

const Sidebar = ({ collapsed, onToggleCollapse, currentProject }: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [projects] = useState([
    { id: '1', name: 'My App Idea', status: 'active' },
    { id: '2', name: 'E-commerce Store', status: 'completed' },
    { id: '3', name: 'Social Platform', status: 'draft' }
  ]);

  // Check for existing dark mode preference
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {!collapsed && (
            <h2 className="font-semibold text-sidebar-foreground">Imagine.bo</h2>
          )}
        </div>
      </div>

      {/* Projects Section */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-sidebar-foreground">Projects</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    project.id === currentProject.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4" />
                    <span className="text-sm truncate">{project.name}</span>
                  </div>
                  <div className={`text-xs mt-1 ${
                    project.status === 'active' ? 'text-green-500' :
                    project.status === 'completed' ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {project.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section - Fixed positioning */}
      <div className="mt-auto p-4 border-t border-sidebar-border space-y-3">
        {!collapsed && (
          <>
            {/* Integration Buttons */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs h-8"
              >
                <Database className="h-3 w-3 mr-2" />
                Connect Supabase
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs h-8"
              >
                <Github className="h-3 w-3 mr-2" />
                Connect GitHub
              </Button>
            </div>
            
            <Separator />
          </>
        )}

        {/* User & Settings - Always at bottom */}
        <div className="space-y-2">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="h-8 w-8 p-0"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60">Pro Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
