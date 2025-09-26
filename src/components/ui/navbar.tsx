import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Rocket, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GitHubIntegration from '../dashboard/GitHubIntegration';
import VercelIntegration from '../dashboard/VercelIntegration';
import AssignToDeveloper from '../dashboard/AssignToDeveloper';
import ImagineboDarkBackground from "../../assets/ImagineboDarkBackground.svg";

interface NavbarProps {
  onPublish?: () => void;
  isFrontendCreated?: boolean;
  sessionId?: string;
}

const Navbar = ({ onPublish, isFrontendCreated = false, sessionId }: NavbarProps) => {
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showVercelModal, setShowVercelModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  return (
    <>
      <Dialog open={showGitHubModal} onOpenChange={setShowGitHubModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Integration
            </DialogTitle>
          </DialogHeader>
          <GitHubIntegration />
        </DialogContent>
      </Dialog>

      <Dialog open={showVercelModal} onOpenChange={setShowVercelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Deploy to Vercel
            </DialogTitle>
          </DialogHeader>
          <VercelIntegration />
        </DialogContent>
      </Dialog>

      {sessionId && (
        <AssignToDeveloper
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          sessionId={sessionId}
        />
      )}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar-background border-b border-sidebar-border flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-32 h-7 rounded-lg">
            <Link to="/">
              <img
                alt="Imagine.bo Logo"
                src={ImagineboDarkBackground}
                className="text-white"
              />
            </Link>
          </div>
        </div>

        {/* GitHub, Assign to Dev, and Publish Buttons */}

        <div className="flex items-center space-x-3">
          {sessionId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 h-8 px-3 text-sm border-sidebar-border hover:bg-sidebar-accent"
            >
              <User className="h-4 w-4" />
              Assign to Dev
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGitHubModal(true)}
            className="flex items-center gap-2 h-8 px-3 text-sm border-sidebar-border hover:bg-sidebar-accent"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Button>

          <Button
            onClick={() => setShowVercelModal(true)}
            size="sm"
            className="flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <Rocket className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;