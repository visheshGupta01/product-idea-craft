
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  ExternalLink,
  Star,
  Users,
  Calendar,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import LoginPage from "@/components/auth/LoginPage";
import SignupPage from "@/components/auth/SignupPage";
import { useUser } from "@/context/UserContext";

type AuthModal = "login" | "signup" | null;

const Community = () => {
  const { user, setUser } = useUser();
  const [authModal, setAuthModal] = useState<AuthModal>(null);

  const handleLogin = (email: string, password: string) => {
    const userData = {
      name: email.split("@")[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
    setAuthModal(null);
  };

  const handleSignup = (email: string, password: string, name: string) => {
    const userData = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAuthModalClose = () => {
    setAuthModal(null);
  };

  const projects = [
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
      case "Live":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Beta":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onLoginClick={() => setAuthModal("login")}
        onSignupClick={() => setAuthModal("signup")}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">Community Showcase</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover amazing projects built by our community. Get inspired and connect with fellow builders.
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              All Categories
            </Button>
            <Button variant="ghost" size="sm">Most Liked</Button>
            <Button variant="ghost" size="sm">Recently Added</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {projects.length} projects
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge 
                  className={`absolute top-3 right-3 text-xs ${getStatusColor(project.status)}`}
                >
                  {project.status}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="font-medium">by {project.author}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>{project.views}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {authModal === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthModal("signup")}
          onClose={handleAuthModalClose}
        />
      )}

      {authModal === "signup" && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthModal("login")}
          onClose={handleAuthModalClose}
        />
      )}
    </div>
  );
};

export default Community;
