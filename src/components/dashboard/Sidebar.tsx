import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Plus, 
  User, 
  Moon, 
  Sun, 
  Database, 
  Github,
  Settings,
  Bell,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Bot,
  Users,
  CreditCard,
  Lightbulb,
  Home
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  assignedTo: 'ai' | 'sde';
  subtasks?: {
    id: number;
    title: string;
    completed: boolean;
  }[];
}

type ActiveView = 'main' | 'team' | 'subscription';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentProject: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  activeView?: ActiveView;
  onViewChange?: (view: ActiveView) => void;
}

const Sidebar = ({ collapsed, onToggleCollapse, currentProject, activeView = 'main', onViewChange }: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: 'Idea Submitted', 
      status: 'completed', 
      description: 'Initial concept captured', 
      assignedTo: 'ai',
      subtasks: [
        { id: 1, title: 'Document requirements', completed: true },
        { id: 2, title: 'Initial review', completed: true }
      ]
    },
    { 
      id: 2, 
      title: 'Competitive Analysis', 
      status: 'in-progress', 
      description: 'Researching market competitors', 
      assignedTo: 'ai',
      subtasks: [
        { id: 3, title: 'Market research', completed: true },
        { id: 4, title: 'Competitor analysis', completed: false },
        { id: 5, title: 'SWOT analysis', completed: false }
      ]
    },
    { 
      id: 3, 
      title: 'Problem Validation', 
      status: 'pending', 
      description: 'Validate core problem exists', 
      assignedTo: 'ai',
      subtasks: [
        { id: 6, title: 'User interviews', completed: false },
        { id: 7, title: 'Survey creation', completed: false }
      ]
    },
    { 
      id: 4, 
      title: 'Research Solutions', 
      status: 'pending', 
      description: 'Find optimal solution approach', 
      assignedTo: 'sde',
      subtasks: [
        { id: 8, title: 'Technology stack research', completed: false },
        { id: 9, title: 'Architecture planning', completed: false }
      ]
    },
    { 
      id: 5, 
      title: 'UI/UX Mockups', 
      status: 'pending', 
      description: 'Design user interface', 
      assignedTo: 'sde',
      subtasks: [
        { id: 10, title: 'Wireframes', completed: false },
        { id: 11, title: 'High-fidelity designs', completed: false }
      ]
    }
  ]);

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progress = (completedTasks / tasks.length) * 100;

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

  const assignToDev = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, assignedTo: 'sde' as const }
        : task
    ));
  };

  const toggleTaskExpanded = (taskId: number) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks?.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Done</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Active</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
    }
  };

  const getAssignmentIcon = (assignedTo: string) => {
    return assignedTo === 'ai' ? (
      <Bot className="h-3 w-3 text-purple-500" />
    ) : (
      <User className="h-3 w-3 text-orange-500" />
    );
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Collapsed buttons */}
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          <Button 
            variant={activeView === 'main' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-10 w-10 p-0" 
            title="Dashboard"
            onClick={() => onViewChange?.('main')}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button 
            variant={activeView === 'team' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-10 w-10 p-0" 
            title="Teams"
            onClick={() => onViewChange?.('team')}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button 
            variant={activeView === 'subscription' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-10 w-10 p-0" 
            title="Subscription"
            onClick={() => onViewChange?.('subscription')}
          >
            <CreditCard className="h-5 w-5" />
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex flex-col items-center space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  My Projects
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  User Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Logo with text */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-bold text-lg text-sidebar-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              imagine.bo
            </h2>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="space-y-2 mb-4">
          <Button
            variant={activeView === 'main' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => onViewChange?.('main')}
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === 'team' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => onViewChange?.('team')}
          >
            <Users className="h-4 w-4 mr-2" />
            Teams
          </Button>
          <Button
            variant={activeView === 'subscription' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => onViewChange?.('subscription')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </Button>
        </div>
        
        {/* Progress Overview - only show on main view */}
        {activeView === 'main' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-sidebar-foreground">Task Progress</h3>
              <span className="text-xs text-muted-foreground">{completedTasks}/{tasks.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>

      {/* Tasks Section - only show on main view */}
      {activeView === 'main' && (
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {tasks.map((task) => {
                const isExpanded = expandedTasks.includes(task.id);
                const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
                const totalSubtasks = task.subtasks?.length || 0;
                
                return (
                  <div key={task.id} className="border border-sidebar-border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-sidebar-foreground truncate">
                            {task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getAssignmentIcon(task.assignedTo)}
                        <span className="text-xs text-muted-foreground">
                          {task.assignedTo === 'ai' ? 'AI' : 'SDE'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.assignedTo === 'ai' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => assignToDev(task.id)}
                            className="text-xs h-6 px-2"
                          >
                            Assign to Dev
                          </Button>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTaskExpanded(task.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        )}
                      </div>
                    </div>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Subtasks: {completedSubtasks}/{totalSubtasks} completed
                      </div>
                    )}

                    {isExpanded && task.subtasks && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-sidebar-border">
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSubtask(task.id, subtask.id)}
                              className="h-4 w-4 p-0"
                            >
                              {subtask.completed ? 
                                <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                                <Circle className="h-3 w-3 text-gray-400" />
                              }
                            </Button>
                            <span className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : 'text-sidebar-foreground'}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-3 flex-shrink-0">
        {/* Integration Buttons - only show on main view */}
        {activeView === 'main' && (
          <>
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

        {/* User & Settings */}
        <div className="space-y-2">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">John Doe</p>
                  <p className="text-xs text-sidebar-foreground/60">Pro Plan</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                My Projects
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                User Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
