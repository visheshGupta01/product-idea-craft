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
        <div className="flex items-center justify-center w-9 h-7 rounded-lg">
          <img src='logo.png' className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          imagine.bo
        </h2>
      </div>

      {/* Frontend Generation Task with Complete Button */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-3 py-1">
          <span className="text-sm text-muted-foreground">Frontend Generation</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // This will trigger the frontend creation completion
              const event = new CustomEvent('frontendComplete');
              window.dispatchEvent(event);
            }}
            className="h-6 text-xs"
          >
            Complete
          </Button>
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
    </div>
  );
};

export default Navbar;