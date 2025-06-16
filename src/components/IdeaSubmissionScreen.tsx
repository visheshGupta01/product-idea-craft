import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Sparkles, Rocket, Code, ArrowRight, ExternalLink, Heart, Eye } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
}

const IdeaSubmissionScreen = ({ onIdeaSubmit }: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState('');

  const headerAnimation = useScrollAnimation();
  const cardsAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();
  const communityAnimation = useScrollAnimation();

  const handleSubmit = () => {
    if (idea.trim()) {
      onIdeaSubmit(idea);
    }
  };

  const inspirationCards = [
    { icon: Lightbulb, text: "Share your vision" },
    { icon: Code, text: "We'll build it" },
    { icon: Rocket, text: "Launch together" }
  ];

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

  const getStatusColor = (status: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden">
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
                src="logo.png" alt="Logo" className="w-32 text-primary-foreground animate-bounce-subtle" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold md:h-14 h-12 mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
            Imagine.bo
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Turn your ideas into revenue-ready apps & websites
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by AI • No coding required
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

        {/* Main Input Section - with scale animation */}
        <div 
          ref={inputAnimation.ref}
          className={`bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5 mb-16 transition-all duration-600 ${
            inputAnimation.isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
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
              className="min-h-[120px] text-base resize-none border-2 focus:border-primary/50 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
            />

            <Button 
              onClick={handleSubmit}
              disabled={!idea.trim()}
              size="lg"
              className="w-full h-12 text-base font-medium rounded-xl group transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Building My Idea
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
                    className={`absolute top-2 right-2 text-xs ${getStatusColor(project.status)}`}
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
