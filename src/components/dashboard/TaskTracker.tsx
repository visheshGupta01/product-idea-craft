
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight,
  Lightbulb,
  Target,
  Search,
  Puzzle,
  Palette,
  Code,
  Database,
  Rocket
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  icon: any;
}

const TaskTracker = () => {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Idea Submitted',
      description: 'Your initial concept has been recorded',
      status: 'completed',
      icon: Lightbulb
    },
    {
      id: '2',
      title: 'Competitive Analysis',
      description: 'Research existing solutions in the market',
      status: 'current',
      icon: Target
    },
    {
      id: '3',
      title: 'Problem Validation',
      description: 'Identify and validate the core problem',
      status: 'pending',
      icon: Search
    },
    {
      id: '4',
      title: 'Research Solutions',
      description: 'Explore potential technical approaches',
      status: 'pending',
      icon: Puzzle
    },
    {
      id: '5',
      title: 'UI/UX Mockups',
      description: 'Design user interface and experience',
      status: 'pending',
      icon: Palette
    },
    {
      id: '6',
      title: 'First Draft Generated',
      description: 'Generate initial version of your app',
      status: 'pending',
      icon: Code
    },
    {
      id: '7',
      title: 'Connect Backend',
      description: 'Set up Supabase integration',
      status: 'pending',
      icon: Database
    },
    {
      id: '8',
      title: 'Deploy & Launch',
      description: 'Make your app live for users',
      status: 'pending',
      icon: Rocket
    }
  ]);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = (completedTasks / tasks.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'current':
        return <Badge variant="default" className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Steps to Launch</h3>
          <Badge variant="outline" className="text-xs">
            {completedTasks}/{tasks.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const Icon = task.icon;
            const isLast = index === tasks.length - 1;
            
            return (
              <div key={task.id} className="relative">
                <div className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  task.status === 'current' 
                    ? 'bg-primary/5 border border-primary/20' 
                    : task.status === 'completed'
                    ? 'bg-green-50 border border-green-200'
                    : 'hover:bg-muted/50'
                }`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${
                        task.status === 'completed' ? 'text-green-700' :
                        task.status === 'current' ? 'text-primary' :
                        'text-foreground'
                      }`}>
                        {task.title}
                      </h4>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {task.status === 'current' && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Continue
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-px h-4 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Estimated completion: 2-3 days
          </p>
          <Button size="sm" className="w-full">
            Get Help from AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskTracker;
