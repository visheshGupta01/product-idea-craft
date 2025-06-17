
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Users,
  Code,
  Globe
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  progress: number;
  lastModified: string;
  technology: string[];
  collaborators: number;
  thumbnail: string;
}

const MyProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Modern e-commerce solution with React and Node.js',
      status: 'active',
      progress: 75,
      lastModified: '2 hours ago',
      technology: ['React', 'Node.js', 'MongoDB'],
      collaborators: 3,
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Collaborative task management tool for teams',
      status: 'completed',
      progress: 100,
      lastModified: '1 day ago',
      technology: ['Vue.js', 'Express', 'PostgreSQL'],
      collaborators: 2,
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Portfolio Website',
      description: 'Personal portfolio with blog functionality',
      status: 'draft',
      progress: 30,
      lastModified: '3 days ago',
      technology: ['Next.js', 'Tailwind'],
      collaborators: 1,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting dashboard',
      status: 'paused',
      progress: 60,
      lastModified: '1 week ago',
      technology: ['React', 'D3.js', 'Firebase'],
      collaborators: 4,
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Code className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-gray-100 text-gray-700'
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full bg-background">
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
              <p className="text-muted-foreground">Manage and track your development projects</p>
            </div>
            <Button className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-fit">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Done</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={project.thumbnail} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      {getStatusBadge(project.status)}
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.technology.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technology.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technology.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.lastModified}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{project.collaborators}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage;
