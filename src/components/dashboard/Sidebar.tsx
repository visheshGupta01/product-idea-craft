import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, User, Moon, Sun, Database, Github, Settings, CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Bot, Users, CreditCard, Lightbulb, Home, FileText, Link, Cat } from 'lucide-react';
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
type ActiveView = 'main' | 'team' | 'subscription' | 'my-projects' | 'user-profile';
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
const Sidebar = ({
  collapsed,
  onToggleCollapse,
  currentProject,
  activeView = 'main',
  onViewChange
}: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([{
    id: 1,
    title: 'Idea Submitted',
    status: 'completed',
    description: 'Initial concept captured',
    assignedTo: 'ai',
    subtasks: [{
      id: 1,
      title: 'Document requirements',
      completed: true
    }, {
      id: 2,
      title: 'Initial review',
      completed: true
    }]
  }, {
    id: 2,
    title: 'Competitive Analysis',
    status: 'in-progress',
    description: 'Researching market competitors',
    assignedTo: 'ai',
    subtasks: [{
      id: 3,
      title: 'Market research',
      completed: true
    }, {
      id: 4,
      title: 'Competitor analysis',
      completed: false
    }, {
      id: 5,
      title: 'SWOT analysis',
      completed: false
    }]
  }, {
    id: 3,
    title: 'Problem Validation',
    status: 'pending',
    description: 'Validate core problem exists',
    assignedTo: 'ai'
  }, {
    id: 4,
    title: 'Research Solutions',
    status: 'pending',
    description: 'Find optimal solution approach',
    assignedTo: 'sde'
  }, {
    id: 5,
    title: 'UI/UX Mockups',
    status: 'pending',
    description: 'Design user interface',
    assignedTo: 'sde'
  }]);
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progress = completedTasks / tasks.length * 100;

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
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      assignedTo: 'sde' as const
    } : task));
  };
  const toggleTaskExpanded = (taskId: number) => {
    setExpandedTasks(prev => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]);
  };
  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      subtasks: task.subtasks?.map(subtask => subtask.id === subtaskId ? {
        ...subtask,
        completed: !subtask.completed
      } : subtask)
    } : task));
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-3 w-3 text-blue-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };
  const getStatusBadge = (status: string) => {
    if (collapsed) return null;
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 px-1 py-0">✓</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 px-1 py-0">•</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-1 py-0">○</Badge>;
    }
  };
  if (collapsed) {
    return <div className="w-12 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col">
        {/* Header */}
        <div className="p-2 border-b border-sidebar-border bg-sidebar flex justify-center">
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0 hover:bg-sidebar-accent">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation icons */}
        <div className="flex-1 flex flex-col items-center py-4 space-y-4 bg-sidebar">
          <Button variant={activeView === 'main' ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0" title="Dashboard" onClick={() => onViewChange?.('main')}>
            <Home className="h-4 w-4" />
          </Button>

          <Button variant={activeView === 'team' ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0" title="Teams" onClick={() => onViewChange?.('team')}>
            <Users className="h-4 w-4" />
          </Button>
          
          <Button variant={activeView === 'subscription' ? 'default' : 'ghost'} size="sm" className="h-8 w-8 p-0" title="Subscription" onClick={() => onViewChange?.('subscription')}>
            <CreditCard className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-2 border-t border-sidebar-border bg-sidebar flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56">
              <DropdownMenuItem onClick={() => onViewChange?.('my-projects')}>
                <Lightbulb className="h-4 w-4 mr-2" />
                My Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange?.('user-profile')}>
                <User className="h-4 w-4 mr-2" />
                User Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings & Integrations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Connect Supabase
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Github className="h-4 w-4 mr-2" />
                  Connect GitHub
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>;
  }
  return <div className="h-full w-full min-w-[240px] bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex-shrink-0 bg-sidebar">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0 hover:bg-sidebar-accent">
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-bold text-base text-sidebar-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              imagine.bo
            </h2>
          </div>
        </div>
        
        {/* Compact Progress Overview */}
        <div className="space-y-2 bg-sidebar-accent/20 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Progress</h3>
            <span className="text-xs text-muted-foreground">{completedTasks}/{tasks.length}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{Math.round(progress)}% complete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Scrollable Tasks Section */}
      <div className="flex-1 min-h-0 bg-sidebar">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {tasks.map(task => {
            const isExpanded = expandedTasks.includes(task.id);
            const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;
            return <div key={task.id} className="border border-sidebar-border rounded-md p-2 bg-sidebar-accent/10 hover:bg-sidebar-accent/20 transition-colors px-[9px] my-[6px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getStatusIcon(task.status)}
                      <h4 className="text-sm font-medium text-sidebar-foreground break-words leading-tight">
                        {task.title}
                      </h4>
                    </div>
                    <div className="flex-shrink-0 ml-2 flex items-center space-x-1">
                      {getStatusBadge(task.status)}
                      {task.subtasks && task.subtasks.length > 0 && <Button variant="ghost" size="sm" onClick={() => toggleTaskExpanded(task.id)} className="h-5 w-5 p-0">
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>}
                    </div>
                  </div>

                  {isExpanded && <>
                      <p className="text-xs text-muted-foreground break-words leading-tight mt-1">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {task.assignedTo === 'ai' ? <Bot className="h-3 w-3 text-purple-500" /> : <User className="h-3 w-3 text-orange-500" />}
                          <span className="text-xs text-muted-foreground">
                            {task.assignedTo === 'ai' ? 'AI' : 'SDE'}
                          </span>
                        </div>
                        
                        {task.subtasks && task.subtasks.length > 0 && <div className="text-xs text-muted-foreground">
                            {completedSubtasks}/{totalSubtasks}
                          </div>}
                      </div>
                      
                      {task.assignedTo === 'ai' && <Button variant="outline" size="sm" onClick={() => assignToDev(task.id)} className="text-xs h-6 w-full mt-2">
                          Assign to Dev
                        </Button>}

                      {task.subtasks && <div className="mt-2 space-y-1 pl-4 border-l-2 border-sidebar-border">
                          {task.subtasks.map(subtask => <div key={subtask.id} className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => toggleSubtask(task.id, subtask.id)} className="h-4 w-4 p-0">
                                {subtask.completed ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Circle className="h-3 w-3 text-gray-400" />}
                              </Button>
                              <span className={`text-xs break-words leading-tight ${subtask.completed ? 'line-through text-muted-foreground' : 'text-sidebar-foreground'}`}>
                                {subtask.title}
                              </span>
                            </div>)}
                        </div>}
                    </>}
                </div>;
          })}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section - Always Visible */}
      <div className="p-2 border-sidebar-border space-y-2 flex-shrink-0 bg-sidebar">
        <Separator className="bg-sidebar-border" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-sidebar-accent rounded-lg p-1.5 transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">John Doe</p>
                <p className="text-xs text-sidebar-foreground/60">Pro Plan</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => onViewChange?.('my-projects')}>
              <Lightbulb className="h-4 w-4 mr-2" />
              My Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange?.('user-profile')}>
              <User className="h-4 w-4 mr-2" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings & Integrations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Connect Supabase
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Sidebar;