import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { developerService, UpdateProfileData } from '@/services/developerService';
import developerLogo from '@/assets/developer-logo.png';

interface FirstTimeSetupProps {
  onComplete: () => void;
}

const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    github_url: '',
    linkedin_url: '',
    bio: '',
    skills: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const availableSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX', 'Figma', 'Vue.js', 'Angular',
    'Next.js', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'JavaScript', 'HTML/CSS'
  ];

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.github_url || !formData.linkedin_url || !formData.first_name || !formData.email) {
      toast({
        title: "Required Fields",
        description: "All required fields must be filled to complete setup.",
        variant: "destructive",
      });
      return;
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please select at least one skill.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await developerService.updateDeveloperProfile({
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        bio: formData.bio,
        skills: formData.skills,
        company_name: '',
        experience: 0,
        hourpaid: 0,
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
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={developerLogo} alt="Developer Logo" className="w-16 h-16 rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Developer</h1>
          <p className="text-muted-foreground text-lg">
            Let's set up your profile to get you started with amazing projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium">
                First Name*
              </Label>
              <Input
                id="first_name"
                placeholder="Your Full Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="h-12 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>
          </div>

          {/* Profile Links Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-sm font-medium">
                GitHub
              </Label>
              <Input
                id="github_url"
                type="url"
                placeholder="Username"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="h-12 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="text-sm font-medium">
                LinkedIn Profile
              </Label>
              <Input
                id="linkedin_url"
                type="url"
                placeholder="Profile-name"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="h-12 rounded-xl border-2 border-border bg-background"
                required
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Skills * (Select at least one)
              </Label>
            </div>
            <div className="flex flex-wrap gap-3">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={formData.skills.includes(skill) ? "default" : "secondary"}
                  className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-colors ${
                    formData.skills.includes(skill)
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, experience, or what you're passionate about..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="rounded-xl border-2 border-border bg-background resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold"
          >
            {loading ? "Setting up..." : "Complete Onboarding"}
          </Button>

          {/* Footer */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">
              By continuing you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">Terms</a>
              {" "}and{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/signin" className="text-primary hover:underline">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstTimeSetup;