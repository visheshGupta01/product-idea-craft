
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
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
  Globe,
  ExternalLink
} from 'lucide-react';
import { fetchProjects, ProjectFromAPI } from '@/services/projectService';

interface Project {
  session_id: string;
  title: string;
  project_url: string;
  deploy_url: string;
  created_at: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
}

const MyProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useUser();

  // Get user's display name
  const getUserName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Your';
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const apiProjects = await fetchProjects();
      
      console.log('Fetched projects:', apiProjects);
      const formattedProjects: Project[] = apiProjects.map(project => ({
        ...project,
        status: project.title ? 'active' : 'draft' as 'active' | 'completed' | 'paused' | 'draft'
      }));
      setProjects(formattedProjects);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    // Navigate with state to pass deploy_url for automatic preview opening
    navigate(`/c/${project.session_id}`, { 
      state: { 
        deployUrl: project.project_url,
        shouldOpenPreview: !!project.deploy_url 
      } 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
    const searchableText = `${project.title || 'Untitled Project'} ${project.session_id}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full bg-[#1B2123]">
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {getUserName()} Projects
              </h1>
              <p className="text-muted-foreground font-supply mt-5">
                Turn your ideas into revenue-ready apps & websites
              </p>
            </div>
            <a href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                <p className=" font-poppins"> New Project</p>
              </Button>
            </a>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-72 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1B2123] border-border border-white border font-poppins"
              />
            </div>
            {/* <div className="flex gap-2 ml-auto">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className={
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
                className={
                  activeFilter === "active"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Active
              </Button>
              <Button
                variant={activeFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("completed")}
                className={
                  activeFilter === "completed"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Done
              </Button>
              <Button
                variant={activeFilter === "paused" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("paused")}
                className={
                  activeFilter === "paused"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Paused
              </Button>
              <Button
                variant={activeFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("draft")}
                className={
                  activeFilter === "draft"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                Draft
              </Button>
            </div> */}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video w-full bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-2 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.session_id}
                  className="hover:shadow-lg bg-black transition-all duration-200 cursor-pointer group border-border overflow-hidden"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="relative">
                    <div className="aspect-video w-full rounded-t-lg overflow-hidden flex items-center justify-center bg-gray-900">
                      {project.session_id ? (
                        <img
                          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${project.session_id}`}
                          alt={project.title || "Project Thumbnail"}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <img
                          src="/default-thumbnail.png" // fallback image in your /public folder
                          alt="Default Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-black">
                    <h3 className="text-xl font-semibold text-foreground mb-2 truncate">
                      {project.title || "Taskflow Pro"}
                    </h3>

                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400  hover:text-blue-300 text-sm truncate block mb-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.project_url}
                      </a>
                    )}
                    {/* 
                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">
                        Last modified 2 hours ago
                      </p>
                    </div> */}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <img src='no-project.png' className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first project to get started"}
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
