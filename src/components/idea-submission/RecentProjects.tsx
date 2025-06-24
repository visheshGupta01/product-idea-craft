
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  lastModified: string;
  image: string;
}

const RecentProjects = () => {
  const recentProjects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Modern shopping experience with AI recommendations",
      status: "active",
      progress: 75,
      lastModified: "2 hours ago",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=150&fit=crop"
    },
    {
      id: 2,
      title: "Task Manager Pro",
      description: "Team collaboration tool with smart scheduling",
      status: "completed",
      progress: 100,
      lastModified: "1 day ago",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=150&fit=crop"
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Real-time data visualization for business insights",
      status: "paused",
      progress: 45,
      lastModified: "3 days ago",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=150&fit=crop"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-3 w-3 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'paused':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="mb-12 animate-fade-up animate-delay-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Your Recent Projects</h2>
          <p className="text-sm text-muted-foreground">Continue where you left off</p>
        </div>
        <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
          View All Projects
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentProjects.map((project, index) => (
          <Card key={project.id} className={`group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 animate-slide-in-left animate-delay-${(index + 1) * 100}`}>
            <div className="relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Badge className={`absolute top-3 right-3 text-xs ${getStatusColor(project.status)} backdrop-blur-sm`}>
                {project.status}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <span className="text-xs">{project.lastModified}</span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-700 group-hover:from-primary/80 group-hover:to-primary"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
