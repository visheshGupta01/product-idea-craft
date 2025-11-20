import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Rocket, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GitHubIntegration from '../dashboard/GitHubIntegration';
import VercelIntegration from '../dashboard/VercelIntegration';
import AssignToDeveloper from '../dashboard/AssignToDeveloper';
import ImagineboIcon from "../../assets/ImagineboIcon.svg";

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
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#1E1E1E] border-b border-[#2A2A2A] flex items-center justify-between px-4">
        {/* Logo and Project Name */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8">
            <Link to="/">
              <img
                alt="Imagine.bo Logo"
                src={ImagineboIcon}
                className="text-white w-full h-full object-contain"
              />
            </Link>
          </div>
          <span className="text-white text-base font-medium">Project Name</span>
        </div>

        {/* Center: Code Icon and Preview */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span className="text-sm">Preview</span>
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          {sessionId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 h-9 px-4 text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <User className="h-4 w-4" />
              Assign to Dev
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGitHubModal(true)}
            className="flex items-center gap-2 h-9 px-4 text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Github className="h-4 w-4" />
            Github
          </Button>

          <Button
            onClick={() => setShowVercelModal(true)}
            size="sm"
            className="flex items-center gap-2 h-9 px-5 bg-[#FF00A9] text-white hover:bg-[#E000A0] font-medium rounded-md"
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