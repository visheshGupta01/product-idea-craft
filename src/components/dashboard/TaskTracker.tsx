
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const TaskTracker = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const tasks = [
    { id: 1, title: 'Idea Submitted', status: 'completed', description: 'Initial concept captured' },
    { id: 2, title: 'Competitive Analysis', status: 'in-progress', description: 'Researching market competitors' },
    { id: 3, title: 'Problem Validation', status: 'pending', description: 'Validate core problem exists' },
    { id: 4, title: 'Research Solutions', status: 'pending', description: 'Find optimal solution approach' },
    { id: 5, title: 'UI/UX Mockups', status: 'pending', description: 'Design user interface' },
    { id: 6, title: 'First Draft Generated', status: 'pending', description: 'Generate initial prototype' },
    { id: 7, title: 'Connect Backend', status: 'pending', description: 'Integrate with Supabase' },
    { id: 8, title: 'Deploy & Launch', status: 'pending', description: 'Make app live' }
  ];

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progress = (completedTasks / tasks.length) * 100;

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

  return (
    <div className="h-screen bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Task Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedTasks} of {tasks.length} completed
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 md:hidden"
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% complete</p>
        </div>
      </div>

      {/* Task List - Scrollable */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'hidden md:block' : ''}`}>
        <div className="p-4 space-y-3">
          {tasks.map((task, index) => (
            <Card key={task.id} className="transition-all hover:shadow-md">
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
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
                {index < tasks.length - 1 && task.status === 'completed' && (
                  <div className="flex justify-center mt-2">
                    <div className="w-px h-4 bg-border"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full text-xs">
          View All Tasks
        </Button>
      </div>
    </div>
  );
};

export default TaskTracker;
