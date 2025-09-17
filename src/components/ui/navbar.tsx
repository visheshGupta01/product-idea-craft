import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImagineboDarkBackground from "../../assets/ImagineboDarkBackground.svg";

interface NavbarProps {
  onPublish?: () => void;
  isFrontendCreated?: boolean;
}

const Navbar = ({ onPublish, isFrontendCreated = false }: NavbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar-background border-b border-sidebar-border flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-32 h-7 rounded-lg">
          <Link to="/">
            <img alt="Imagine.bo Logo" src={ImagineboDarkBackground} className="text-white" />
          </Link>
        </div>
      </div>

      {/* GitHub and Publish Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Open GitHub integration or redirect to GitHub
            console.log('GitHub integration clicked');
            // You can add GitHub integration modal or redirect logic here
          }}
          className="flex items-center gap-2 h-8 px-3 text-sm border-sidebar-border hover:bg-sidebar-accent"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        
        <Button
          onClick={onPublish}
          size="sm"
          className="flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        >
          <Rocket className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default Navbar;