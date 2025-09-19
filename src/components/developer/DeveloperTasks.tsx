import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, User, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { developerService, Task } from '@/services/developerService';
import { format } from 'date-fns';

const DeveloperTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTasks, setUpdatingTasks] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await developerService.getDeveloperTasks();
      setTasks(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'done') => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    try {
      await developerService.updateTaskStatus(taskId, newStatus);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.ID === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'done':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
        <p className="text-muted-foreground">Manage your assigned development tasks</p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Assigned</h3>
            <p className="text-muted-foreground">
              You don't have any tasks assigned at the moment. Check back later!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.ID} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(task.status) as any} className="flex items-center space-x-1">
                      {getStatusIcon(task.status)}
                      <span>{getStatusDisplay(task.status)}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Task #{task.ID}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>Created {format(new Date(task.CreatedAt), 'MMM dd, yyyy')}</span>
                      </div>
                      {task.due_date && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Due {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {task.assigner_id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Assigned by {task.assigner_id}
                      </span>
                    </div>

                    <Select
                      value={task.status}
                      onValueChange={(newStatus: 'todo' | 'in_progress' | 'done') => 
                        updateTaskStatus(task.ID, newStatus)
                      }
                      disabled={updatingTasks.has(task.ID)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperTasks;