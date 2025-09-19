import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Github, 
  Linkedin, 
  MapPin, 
  Star,
  DollarSign,
  Building,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { developerService, DeveloperProfile as DeveloperProfileType, DeveloperStats, UpdateProfileData } from '@/services/developerService';
import { format } from 'date-fns';

const DeveloperProfile = () => {
  const [profile, setProfile] = useState<DeveloperProfileType | null>(null);
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<UpdateProfileData>({});
  const [skills, setSkills] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await developerService.getDeveloperProfile();
      setProfile(response.data.developer_info);
      setStats({
        total_tasks: response.data.total_tasks,
        total_pending: response.data.total_pending,
        total_complete: response.data.total_complete,
      });
      
      // Initialize edit data
      setEditData({
        github_url: response.data.developer_info.github_url || '',
        linkedin_url: response.data.developer_info.linkedin_url || '',
        company_name: response.data.developer_info.company_name || '',
        experience: response.data.developer_info.experience || '',
        bio: response.data.developer_info.bio || '',
        hourpaid: response.data.developer_info.hourpaid || 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      await developerService.updateDeveloperProfile({
        ...editData,
        skills: skillsArray,
      });

      await loadProfile(); // Reload profile data
      setEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    return profile?.email?.[0]?.toUpperCase() || 'D';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground">Unable to load your developer profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Developer Profile</h1>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>
        <Button
          variant={editing ? "outline" : "default"}
          onClick={() => {
            if (editing) {
              setEditing(false);
              setEditData({
                github_url: profile.github_url || '',
                linkedin_url: profile.linkedin_url || '',
                company_name: profile.company_name || '',
                experience: profile.experience || '',
                bio: profile.bio || '',
                hourpaid: profile.hourpaid || 0,
              });
            } else {
              setEditing(true);
            }
          }}
        >
          {editing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total_tasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.total_complete}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.total_pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{profile.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-2">
                    ({profile.total_solved_tasks} tasks solved)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.city}, {profile.country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {format(new Date(profile.created_at), 'MMM yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Balance: ${profile.balances.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={profile.is_plan_active ? "default" : "secondary"}>
                  {profile.is_plan_active ? "Active Plan" : "Inactive Plan"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={editData.github_url}
                    onChange={(e) => setEditData({ ...editData, github_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={editData.linkedin_url}
                    onChange={(e) => setEditData({ ...editData, linkedin_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Company
                  </Label>
                  <Input
                    id="company_name"
                    value={editData.company_name}
                    onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Experience
                  </Label>
                  <Input
                    id="experience"
                    value={editData.experience}
                    onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourpaid" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Hourly Rate (USD)
                  </Label>
                  <Input
                    id="hourpaid"
                    type="number"
                    value={editData.hourpaid}
                    onChange={(e) => setEditData({ ...editData, hourpaid: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.github_url && (
                  <div className="flex items-center space-x-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={profile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}

                {profile.linkedin_url && (
                  <div className="flex items-center space-x-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}

                {profile.company_name && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.company_name}</span>
                  </div>
                )}

                {profile.experience && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.experience} experience</span>
                  </div>
                )}

                {profile.hourpaid && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${profile.hourpaid}/hour</span>
                  </div>
                )}

                {profile.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperProfile;