
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Bot, User } from 'lucide-react';

const TaskTracker = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Idea Submitted', status: 'completed', description: 'Initial concept captured', assignedTo: 'ai' },
    { id: 2, title: 'Competitive Analysis', status: 'in-progress', description: 'Researching market competitors', assignedTo: 'ai' },
    { id: 3, title: 'Problem Validation', status: 'pending', description: 'Validate core problem exists', assignedTo: 'ai' },
    { id: 4, title: 'Research Solutions', status: 'pending', description: 'Find optimal solution approach', assignedTo: 'sde' },
    { id: 5, title: 'UI/UX Mockups', status: 'pending', description: 'Design user interface', assignedTo: 'sde' },
    { id: 6, title: 'First Draft Generated', status: 'pending', description: 'Generate initial prototype', assignedTo: 'ai' },
    { id: 7, title: 'Connect Backend', status: 'pending', description: 'Integrate with Supabase', assignedTo: 'sde' },
    { id: 8, title: 'Deploy & Launch', status: 'pending', description: 'Make app live', assignedTo: 'sde' }
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

  return (
    <div className={`bg-card flex flex-col transition-all duration-300 ${isCollapsed ? 'h-auto' : 'h-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-foreground">Task Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedTasks} of {tasks.length} completed
              </p>
            </div>
            {/* Progress Bar */}
            <div className="flex-1 max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% complete</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
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
                <Card key={task.id} className="flex-shrink-0 w-64 transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <CardTitle className="text-sm font-medium leading-tight">
                          {task.title}
                        </CardTitle>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {task.description}
                    </p>
                    
                    {/* Assignment Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getAssignmentIcon(task.assignedTo)}
                        <span className="text-xs text-muted-foreground">
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
