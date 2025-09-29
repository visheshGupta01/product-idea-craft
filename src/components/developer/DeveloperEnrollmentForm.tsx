import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { developerService, CreateDeveloperData } from '@/services/developerService';

const predefinedSkills = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'PHP',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Git', 'GraphQL', 'REST API', 'Vue.js', 'Angular', 'Next.js', 'Express.js',
  'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'Go', 'Rust'
];

const developerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  company_name: z.string().max(255).optional(),
  experience: z.string().max(1000).optional(),
  bio: z.string().max(1000).optional(),
  hourpaid: z.number().min(1, 'Hourly rate must be at least $1').max(1000, 'Hourly rate too high')
});

type DeveloperFormData = z.infer<typeof developerSchema>;

interface DeveloperEnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperEnrollmentForm: React.FC<DeveloperEnrollmentFormProps> = ({
  isOpen,
  onClose
}) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      hourpaid: 25
    }
  });

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const filteredPredefinedSkills = predefinedSkills.filter(
    skill => 
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.includes(skill)
  );

  const onSubmit = async (data: DeveloperFormData) => {
    if (skills.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one skill",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const developerData: CreateDeveloperData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        skills,
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        company_name: data.company_name || '',
        experience: data.experience || '',
        bio: data.bio || '',
        hourpaid: data.hourpaid
      };

      await developerService.createDeveloper(developerData);
      setShowSuccess(true);
      reset();
      setSkills([]);
      setSkillInput('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit application. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSkills([]);
      setSkillInput('');
      setShowSuccess(false);
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your application. You will receive an email with your login credentials shortly.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Developer Enrollment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                className={errors.first_name ? 'border-red-500' : ''}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                className={errors.last_name ? 'border-red-500' : ''}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                {...register('github_url')}
                placeholder="https://github.com/username"
                className={errors.github_url ? 'border-red-500' : ''}
              />
              {errors.github_url && (
                <p className="text-sm text-red-500 mt-1">{errors.github_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/username"
                className={errors.linkedin_url ? 'border-red-500' : ''}
              />
              {errors.linkedin_url && (
                <p className="text-sm text-red-500 mt-1">{errors.linkedin_url.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Skills *</Label>
            <div className="space-y-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
                placeholder="Type a skill and press Enter"
              />
              
              {skillInput && filteredPredefinedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
                  {filteredPredefinedSkills.slice(0, 10).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addSkill(skill)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="default" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder="Current or previous company"
              />
            </div>

            <div>
              <Label htmlFor="hourpaid">Hourly Rate (USD) *</Label>
              <Input
                id="hourpaid"
                type="number"
                min="1"
                max="1000"
                {...register('hourpaid', { valueAsNumber: true })}
                className={errors.hourpaid ? 'border-red-500' : ''}
              />
              {errors.hourpaid && (
                <p className="text-sm text-red-500 mt-1">{errors.hourpaid.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              {...register('experience')}
              placeholder="Describe your professional experience..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};