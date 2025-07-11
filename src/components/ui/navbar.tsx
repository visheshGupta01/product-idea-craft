import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

interface NavbarProps {
  onPublish?: () => void;
}

const Navbar = ({ onPublish }: NavbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
          <span className="text-accent-foreground font-bold text-sm">L</span>
        </div>
        <span className="font-semibold text-foreground">Lovable</span>
      </div>

      {/* Publish Button */}
      <Button 
        onClick={onPublish}
        variant="default"
        size="sm"
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Rocket className="h-4 w-4 mr-2" />
        Publish
      </Button>
    </div>
  );
};

export default Navbar;