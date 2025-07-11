
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Lightbulb, BarChart3, Puzzle, Layers, Monitor, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';

const TaskTracker = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Idea Submitted', status: 'completed', description: 'Initial concept captured', assignedTo: 'ai', icon: Lightbulb },
    { id: 2, title: 'Competitive analysis', status: 'in-progress', description: 'Researching market competitors', assignedTo: 'ai', icon: BarChart3 },
    { id: 3, title: 'Gap Analysis', status: 'pending', description: 'Validate core problem exists', assignedTo: 'ai', icon: Puzzle },
    { id: 4, title: 'Research Solutions', status: 'pending', description: 'Find optimal solution approach', assignedTo: 'sde', icon: Layers },
    { id: 5, title: 'UI/UX Mockups', status: 'pending', description: 'Design user interface', assignedTo: 'sde', icon: Monitor }
  ]);

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progress = (completedTasks / tasks.length) * 100;

  const toggleAssignment = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, assignedTo: task.assignedTo === 'ai' ? 'sde' : 'ai' }
        : task
    ));
  };

  const getTaskIcon = (TaskIcon: any, status: string) => {
    const iconClass = status === 'completed' ? 'text-green-500' : status === 'in-progress' ? 'text-blue-500' : 'text-gray-400';
    return <TaskIcon className={`h-6 w-6 ${iconClass}`} />;
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

  return (
    <div className={`bg-sidebar-background flex flex-col transition-all duration-300 ${isCollapsed ? 'h-auto' : 'h-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-sidebar-foreground">Task Progress</h3>
              <p className="text-sm text-sidebar-foreground/60">
                {completedTasks} of {tasks.length} completed
              </p>
            </div>
            {/* Progress Bar */}
            <div className="flex-1 max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-sidebar-foreground/60 mt-1">{Math.round(progress)}% complete</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Task List - Horizontal Scrollable */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          <div className="p-4 h-full overflow-x-auto">
            <div className="flex space-x-3 h-full">
              {tasks.map((task, index) => (
                 <Card key={task.id} className="flex-shrink-0 w-64 transition-all hover:shadow-md bg-sidebar-background border-sidebar-border">
                   <CardHeader className="pb-2">
                     <div className="flex flex-col items-center space-y-3">
                       <div className="flex items-center justify-center w-12 h-12 bg-sidebar-accent rounded-lg">
                         {getTaskIcon(task.icon, task.status)}
                       </div>
                       <div className="text-center">
                         <CardTitle className="text-sm font-medium leading-tight text-sidebar-foreground">
                           {task.title}
                         </CardTitle>
                         {getStatusBadge(task.status)}
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <p className="text-xs text-sidebar-foreground/60 leading-relaxed mb-3 text-center">
                       {task.description}
                     </p>
                     
                     {/* Assignment Toggle */}
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         {getAssignmentIcon(task.assignedTo)}
                         <span className="text-xs text-sidebar-foreground/60">
                           {task.assignedTo === 'ai' ? 'AI' : 'SDE'}
                         </span>
                       </div>
                       <Switch
                         checked={task.assignedTo === 'sde'}
                         onCheckedChange={() => toggleAssignment(task.id)}
                         className="scale-75"
                       />
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
