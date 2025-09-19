import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Github, Linkedin, User, Building, Clock, DollarSign } from 'lucide-react';
import { developerService, UpdateProfileData } from '@/services/developerService';

interface FirstTimeSetupProps {
  onComplete: () => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UpdateProfileData>({
    github_url: '',
    linkedin_url: '',
    company_name: '',
    experience: '',
    bio: '',
    hourpaid: 0,
    skills: [],
  });
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.github_url || !formData.linkedin_url) {
      toast({
        title: "Required Fields",
        description: "GitHub and LinkedIn URLs are required to complete setup.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      await developerService.updateDeveloperProfile({
        ...formData,
        skills: skillsArray,
      });

      toast({
        title: "Profile Setup Complete",
        description: "Your developer profile has been successfully created.",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Developer Profile</CardTitle>
          <CardDescription>
            Please provide your GitHub and LinkedIn profiles to get started as a developer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <User className="h-5 w-5 mr-2" />
                Required Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="github_url" className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub URL *
                </Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn URL *
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Current Company
                  </Label>
                  <Input
                    id="company_name"
                    placeholder="Acme Inc."
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Experience
                  </Label>
                  <Input
                    id="experience"
                    placeholder="5 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourpaid" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Hourly Rate (USD)
                </Label>
                <Input
                  id="hourpaid"
                  type="number"
                  placeholder="50"
                  value={formData.hourpaid}
                  onChange={(e) => setFormData({ ...formData, hourpaid: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="React, Node.js, Python, Docker"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your development experience..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstTimeSetup;