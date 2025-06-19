
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import DevicePreview, { DeviceType } from './DevicePreview';
import DeviceToggle from './DeviceToggle';

interface FullscreenPreviewProps {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  src: string;
  onClose: () => void;
}

const FullscreenPreview: React.FC<FullscreenPreviewProps> = ({
  device,
  onDeviceChange,
  src,
  onClose
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header with controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-4">
        <DeviceToggle 
          activeDevice={device}
          onDeviceChange={onDeviceChange}
          className="shadow-lg"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex items-center space-x-2 shadow-lg"
        >
          <X className="w-4 h-4" />
          <span>Exit Fullscreen</span>
        </Button>
      </div>
      
      {/* Preview area */}
      <div className="w-full h-full pt-16">
        <DevicePreview
          device={device}
          src={src}
          isFullscreen={true}
        />
      </div>
    </div>
  );
};

export default FullscreenPreview;
