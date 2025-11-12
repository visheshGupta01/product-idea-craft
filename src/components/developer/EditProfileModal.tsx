import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { developerService, DeveloperInfo } from "@/services/developerService";
import { useToast } from "@/hooks/use-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DeveloperInfo;
  onSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    github_url: profile.github_url || "",
    linkedin_url: profile.linkedin_url || "",
    bio: profile.bio || "",
    experience: profile.experience || "",
    hourpaid: profile.hourpaid || 0,
    skills: profile.skills || [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        hourpaid: profile.hourpaid || 0,
        skills: profile.skills || [],
      });
    }
  }, [isOpen, profile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await developerService.updateDeveloperProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              type="url"
              placeholder="https://github.com/username"
              value={formData.github_url}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin_url}
              onChange={(e) =>
                setFormData({ ...formData, linkedin_url: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourpaid">Hourly Rate ($)</Label>
            <Input
              id="hourpaid"
              type="number"
              min="0"
              placeholder="50"
              value={formData.hourpaid}
              onChange={(e) =>
                setFormData({ ...formData, hourpaid: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              placeholder="e.g., 5 years"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-pink-500 text-white"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
