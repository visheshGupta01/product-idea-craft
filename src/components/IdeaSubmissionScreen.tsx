import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles, Rocket, Code, ArrowRight, ExternalLink, Heart, Eye, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
  user?: { name: string; email: string; avatar?: string };
}

const IdeaSubmissionScreen = ({ onIdeaSubmit, user }: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerAnimation = useScrollAnimation();
  const cardsAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();
  const communityAnimation = useScrollAnimation();

  const handleSubmit = () => {
    if (idea.trim()) {
      setIsSubmitting(true);
      // Trigger the animation and transition
      setTimeout(() => {
        onIdeaSubmit(idea);
      }, 800); // Allow time for animation
    }
  };

  const inspirationCards = [
    { icon: Lightbulb, text: "Share your vision" },
    { icon: Code, text: "We'll build it" },
    { icon: Rocket, text: "Launch together" }
  ];

  const recentProjects = [
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
        return <Code className="h-3 w-3 text-gray-500" />;
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

  const communityProjects = [
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

  // If user is logged in, show ultra-compact layout
  if (user) {
    return (
      <div className={`h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden transition-all duration-800 ${
        isSubmitting ? 'scale-105 blur-sm' : 'scale-100 blur-none'
      }`}>
        {/* Animated textbox overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm">
            <div className="animate-scale-in">
              <Textarea
                value={idea}
                readOnly
                className="w-96 h-32 text-base border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 bg-card"
              />
            </div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="h-full flex flex-col">
          {/* Compact Input Section - Fixed at top */}
          <div className="flex-shrink-0 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-lg shadow-primary/5">
                <div className="space-y-3">
                  <Textarea
                    placeholder="What's your next big idea?"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[80px] text-base resize-none border-2 focus:border-primary/50 rounded-xl"
                  />

                  <Button 
                    onClick={handleSubmit}
                    disabled={!idea.trim() || isSubmitting}
                    size="lg"
                    className="w-full h-10 text-base font-medium rounded-xl group"
                  >
                    {isSubmitting ? 'Processing...' : 'Start Building'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects Section - Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Your Recent Projects</h2>
                <Button variant="outline" size="sm" className="text-xs h-8">View All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recentProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-card/60 backdrop-blur-sm">
                    <div className="relative">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-20 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-1 right-1 text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-1">
                      <CardTitle className="text-sm font-semibold leading-tight mb-1">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-3">
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(project.status)}
                          <span>{project.progress}%</span>
                        </div>
                        <span>{project.lastModified}</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original layout for non-logged-in users
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden transition-all duration-800 ${
      isSubmitting ? 'scale-105 blur-sm' : 'scale-100 blur-none'
    }`}>
      {/* Animated textbox overlay - appears during transition */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm">
          <div className="animate-scale-in">
            <Textarea
              value={idea}
              readOnly
              className="w-96 h-32 text-base border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 bg-card"
            />
          </div>
        </div>
      )}

      {/* Theme Toggle Button - with float animation */}
      <div className="fixed top-6 right-6 z-10 animate-float">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header - with fade up animation */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-12 transition-all duration-800 ${
            headerAnimation.isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center mt-2 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse-glow">
              <img
                src="logo.png" alt="Logo" className="w-8 mt-1 ml-1 text-primary-foreground animate-bounce-subtle" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold md:h-14 h-12 mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
            Imagine.bo
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Turn your ideas into revenue-ready apps & websites
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by AI & SDE • No coding required
          </p>
        </div>

        {/* Inspiration Cards - with staggered slide animations */}
        <div 
          ref={cardsAnimation.ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {inspirationCards.map((card, index) => (
            <div 
              key={index}
              className={`bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                cardsAnimation.isVisible 
                  ? `animate-slide-in-left animate-delay-${(index + 1) * 100}`
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-card-foreground">{card.text}</p>
            </div>
          ))}
        </div>

        {/* Main Input Section - with scale animation and submission state */}
        <div 
          ref={inputAnimation.ref}
          className={`bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5 mb-16 transition-all duration-600 ${
            inputAnimation.isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          } ${
            isSubmitting ? 'scale-110 shadow-2xl shadow-primary/20' : 'scale-100'
          }`}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-card-foreground">What's your idea?</h2>
            <p className="text-muted-foreground">
              We'll help turn this into a real product—sit tight.
            </p>
          </div>

          <div className="space-y-6">
            <Textarea
              placeholder="Describe your app or website idea in detail... 

For example: 'A marketplace for local artists to sell their digital artwork, with features for artist profiles, secure payments, and community reviews.'"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={isSubmitting}
              className={`min-h-[120px] text-base resize-none border-2 focus:border-primary/50 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 ${
                isSubmitting ? 'border-primary/50 shadow-lg shadow-primary/10' : ''
              }`}
            />

            <Button 
              onClick={handleSubmit}
              disabled={!idea.trim() || isSubmitting}
              size="lg"
              className="w-full h-12 text-base font-medium rounded-xl group transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing your idea...' : 'Start Building My Idea'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Your idea is secure and will only be used to help you build your product
          </div>
        </div>

        {/* Community Section - with slide animations */}
        <div 
          ref={communityAnimation.ref}
          className="mb-12"
        >
          <div className={`text-center mb-8 transition-all duration-600 ${
            communityAnimation.isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl font-bold mb-3 text-foreground">Built by Our Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what amazing projects other builders have created with Imagine.bo. 
              Get inspired and join thousands of successful entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityProjects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-2 overflow-hidden bg-card/60 backdrop-blur-sm border-border/50 ${
                  communityAnimation.isVisible 
                    ? `animate-slide-in-right animate-delay-${(index + 1) * 100}`
                    : 'opacity-0 translate-x-8'
                }`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 text-xs ${getCommunityStatusColor(project.status)}`}
                  >
                    {project.status}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold leading-tight mb-1">
                        {project.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>by {project.author}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{project.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.views}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-fade-up animate-delay-500">
          <p>Join thousands of builders who have launched their ideas with Imagine.bo</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionScreen;
