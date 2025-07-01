
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  Eye, 
  Settings, 
  Edit,
  Trophy,
  Target,
  Code,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const user = {
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    bio: "Full-stack developer passionate about creating innovative solutions. I love building products that make a difference and connecting with fellow developers.",
    skills: ["React", "TypeScript", "Node.js", "Python", "AI/ML", "UI/UX"],
    stats: {
      projects: 12,
      followers: 1240,
      following: 89,
      totalLikes: 3420
    }
  };

  const projects = [
    {
      id: 1,
      title: "TaskFlow Pro",
      description: "A comprehensive productivity app with AI-powered features",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      likes: 142,
      views: 2340,
      status: "Live"
    },
    {
      id: 2,
      title: "Weather Dashboard",
      description: "Beautiful weather app with forecasts and analytics",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
      likes: 89,
      views: 1560,
      status: "Live"
    },
    {
      id: 3,
      title: "Recipe Finder",
      description: "Find recipes based on ingredients you have at home",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
      likes: 76,
      views: 980,
      status: "Beta"
    }
  ];

  const achievements = [
    { icon: Trophy, title: "Top Creator", description: "Most liked project this month" },
    { icon: Star, title: "Rising Star", description: "Fastest growing profile" },
    { icon: Target, title: "Goal Crusher", description: "Completed 10 projects" },
    { icon: Users, title: "Community Hero", description: "Helped 100+ developers" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={null}
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        onLogout={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button className="gap-2 mb-4">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined {user.joinDate}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-6">{user.bio}</p>
                
                {/* Skills */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.projects}</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.totalLikes}</div>
                    <div className="text-sm text-muted-foreground">Total Likes</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  My Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant={project.status === 'Live' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {project.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {project.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <achievement.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
