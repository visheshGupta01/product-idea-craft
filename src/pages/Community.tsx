
import React, { useCallback, useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";

type AuthModal = "login" | "signup" | null;
type AppState =
  | "idea-submission"
  | "follow-up-questions"
  | "verification"
  | "dashboard";

const Community = () => {
  const { user,signup,logout } = useUser();
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [appState, setAppState] = useState<AppState>("idea-submission");
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
    const location = useLocation();
  
  const handleSignup = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      await signup(
        name,
        email,
        password, // if your context accepts and uses this
        false
      ); // call signup from context
      setAuthModal(null);
      setIsSubmittingIdea(false);
      setAppState("verification"); // trigger email verification screen
    } catch (error) {
      console.error("Signup failed:", error);
      // TODO: Show error to user if needed
    }
  };

const handleLogout = useCallback(() => {
    logout(); // <- from context
    setAppState("idea-submission");
    setIsSubmittingIdea(false);
  }, [logout]);
  
  useEffect(() => {
    if (location.state?.logout) {
      handleLogout();
    }
  }, [location.state, handleLogout]);

  const handleAuthModalClose = () => {
    setAuthModal(null);
  };

  const projects = [
    {
      id: 1,
      title: "TaskFlow Pro",
      description:
        "A comprehensive productivity app that helps teams manage projects with AI-powered insights, automated workflows, and real-time collaboration features.",
      author: "Sarah Chen",
      category: "Productivity",
      likes: 142,
      views: 2340,
      stars: 89,
      status: "Live",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop",
      date: "2024-01-15",
      tags: ["React", "AI", "Productivity"],
    },
    {
      id: 2,
      title: "Local Artisan Hub",
      description:
        "A beautiful marketplace connecting local artists with customers worldwide, featuring secure payments, community reviews, and artist portfolio management.",
      author: "Marcus Rodriguez",
      category: "E-commerce",
      likes: 89,
      views: 1560,
      stars: 67,
      status: "Live",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=300&fit=crop",
      date: "2024-01-12",
      tags: ["E-commerce", "Marketplace", "Payments"],
    },
    {
      id: 3,
      title: "EcoTrack",
      description:
        "Personal carbon footprint tracker with gamification elements, sustainability challenges, and community features to promote environmental awareness.",
      author: "Emma Thompson",
      category: "Sustainability",
      likes: 76,
      views: 980,
      stars: 45,
      status: "Beta",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=300&fit=crop",
      date: "2024-01-10",
      tags: ["Sustainability", "Gamification", "Environment"],
    },
    {
      id: 4,
      title: "MindfulMoments",
      description:
        "AI-powered meditation and mindfulness app with personalized sessions, progress tracking, and community support for mental wellness.",
      author: "David Kim",
      category: "Health & Wellness",
      likes: 203,
      views: 3200,
      stars: 134,
      status: "Live",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
      date: "2024-01-08",
      tags: ["Health", "AI", "Meditation"],
    },
    {
      id: 5,
      title: "CodeMentor",
      description:
        "Interactive coding platform for beginners with step-by-step tutorials, live coding sessions, and peer-to-peer learning communities.",
      author: "Alex Johnson",
      category: "Education",
      likes: 156,
      views: 2100,
      stars: 98,
      status: "Live",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
      date: "2024-01-05",
      tags: ["Education", "Coding", "Learning"],
    },
    {
      id: 6,
      title: "FitTracker Plus",
      description:
        "Comprehensive fitness tracking app with workout plans, nutrition tracking, and social features to keep users motivated and engaged.",
      author: "Lisa Park",
      category: "Fitness",
      likes: 187,
      views: 2800,
      stars: 112,
      status: "Live",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
      date: "2024-01-03",
      tags: ["Fitness", "Health", "Social"],
    }];

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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Community Projects</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing projects built by our community of talented
            developers and entrepreneurs. Get inspired and share your own
            creations!
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            All Categories
          </Button>
          <Button variant="ghost">Productivity</Button>
          <Button variant="ghost">E-commerce</Button>
          <Button variant="ghost">Health & Wellness</Button>
          <Button variant="ghost">Education</Button>
          <Button variant="ghost">Sustainability</Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge
                  className={`absolute top-4 right-4 ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </Badge>
                <Button
                  size="sm"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{project.category}</Badge>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {project.author}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {project.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {project.stars}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" className="gap-2">
            Load More Projects
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {authModal === "login" && (
        <LoginPage
          onSwitchToSignup={() => setAuthModal("signup")}
          onClose={handleAuthModalClose}
        />
      )}

      {authModal === "signup" && (
        <SignupPage
          onSignup={handleSignup} // ✅ pass this
          onSwitchToLogin={() => setAuthModal("login")}
          onClose={handleAuthModalClose}
        />
      )}
    </div>
  );
};

export default Community;
