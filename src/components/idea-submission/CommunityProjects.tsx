
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface CommunityProject {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  likes: number;
  views: number;
  status: string;
  image: string;
}

const CommunityProjects = () => {
  const communityAnimation = useScrollAnimation();

  const communityProjects: CommunityProject[] = [
    {
      id: 1,
      title: "TaskFlow Pro",
      description: "A productivity app that helps teams manage projects with AI-powered insights and automated workflows.",
      author: "Sarah Chen",
      category: "Productivity",
      likes: 142,
      views: 2340,
      status: "Live",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Local Artisan Hub",
      description: "A marketplace connecting local artists with customers, featuring secure payments and community reviews.",
      author: "Marcus Rodriguez",
      category: "E-commerce",
      likes: 89,
      views: 1560,
      status: "Live",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "EcoTrack",
      description: "Personal carbon footprint tracker with gamification elements and sustainability challenges.",
      author: "Emma Thompson",
      category: "Sustainability",
      likes: 76,
      views: 980,
      status: "Beta",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "MindfulMoments",
      description: "AI-powered meditation and mindfulness app with personalized sessions and progress tracking.",
      author: "David Kim",
      category: "Health & Wellness",
      likes: 203,
      views: 3200,
      status: "Live",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
    }
  ];

  const getCommunityStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Beta':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div 
      ref={communityAnimation.ref}
      className="mb-12"
    >
      <div className={`text-center mb-8 transition-all duration-600 ${
        communityAnimation.isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 animate-bounce-subtle">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-foreground">Built by Our Community</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Discover amazing projects created by builders like you. Get inspired and join thousands of successful entrepreneurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityProjects.map((project, index) => (
          <Card 
            key={project.id} 
            className={`group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 hover:-translate-y-3 overflow-hidden bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 cursor-pointer ${
              communityAnimation.isVisible 
                ? `animate-slide-in-right animate-delay-${(index + 1) * 150}`
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Badge 
                className={`absolute top-3 right-3 text-xs ${getCommunityStatusColor(project.status)} backdrop-blur-sm`}
              >
                {project.status}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-bold leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-300">
                    {project.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="font-medium">by {project.author}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200">
                    <Heart className="w-3 h-3" />
                    <span>{project.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200">
                    <Eye className="w-3 h-3" />
                    <span>{project.views}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityProjects;
