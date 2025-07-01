
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Crown, 
  Calendar, 
  Star, 
  MoreHorizontal,
  Settings,
  UserPlus,
  Folder,
  Activity
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Teams = () => {
  const teams = [
    {
      id: 1,
      name: "Innovation Labs",
      description: "Building the future of productivity tools with AI and automation",
      members: [
        { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", role: "Owner" },
        { name: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike", role: "Developer" },
        { name: "Lisa Park", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa", role: "Designer" },
        { name: "Alex Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex", role: "Developer" }
      ],
      projects: 8,
      created: "2024-01-15",
      isOwner: true
    },
    {
      id: 2,
      name: "Creative Collective",
      description: "Artists and developers collaborating on creative digital experiences",
      members: [
        { name: "Emma Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma", role: "Owner" },
        { name: "David Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david", role: "Artist" },
        { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", role: "Developer" }
      ],
      projects: 5,
      created: "2024-01-10",
      isOwner: false
    },
    {
      id: 3,
      name: "Startup Builders",
      description: "Fast-moving team focused on building and launching MVPs quickly",
      members: [
        { name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john", role: "Owner" },
        { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", role: "Co-founder" },
        { name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane", role: "Product Manager" }
      ],
      projects: 12,
      created: "2023-12-20",
      isOwner: false
    }
  ];

  const recentActivity = [
    { team: "Innovation Labs", action: "launched new project", time: "2 hours ago" },
    { team: "Creative Collective", action: "added new member", time: "1 day ago" },
    { team: "Startup Builders", action: "completed milestone", time: "2 days ago" },
    { team: "Innovation Labs", action: "updated team settings", time: "3 days ago" }
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Teams</h1>
            <p className="text-muted-foreground">
              Collaborate with others to build amazing projects together
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams List */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {teams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {team.name}
                            {team.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {team.members.length} members • {team.projects} projects
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{team.description}</p>
                    
                    {/* Members */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium">Members</h4>
                        <Badge variant="secondary" className="text-xs">
                          {team.members.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 4).map((member, index) => (
                            <Avatar key={index} className="w-8 h-8 border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {team.members.length > 4 && (
                            <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-medium">+{team.members.length - 4}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          <UserPlus className="w-3 h-3" />
                          Invite
                        </Button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Folder className="w-4 h-4" />
                        View Projects
                      </Button>
                      {team.isOwner && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Teams</span>
                    <span className="font-semibold">{teams.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <span className="font-semibold">{teams.reduce((acc, team) => acc + team.projects, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Teams Owned</span>
                    <span className="font-semibold">{teams.filter(team => team.isOwner).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.team}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create Team CTA */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Start a New Team</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite collaborators and build amazing projects together
                </p>
                <Button className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
