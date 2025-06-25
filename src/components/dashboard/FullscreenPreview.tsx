
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { DeviceType, deviceConfigs } from './DevicePreview';

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
  const config = deviceConfigs[device];

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleDevice = () => {
    const devices: DeviceType[] = ['desktop', 'tablet', 'phone'];
    const currentIndex = devices.indexOf(device);
    const nextIndex = (currentIndex + 1) % devices.length;
    onDeviceChange(devices[nextIndex]);
  };

  const getDeviceIcon = () => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'phone':
        return <Smartphone className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDevice}
          className="flex items-center space-x-2 shadow-lg bg-background/95 backdrop-blur-sm"
        >
          {getDeviceIcon()}
          <span className="capitalize">{device}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex items-center space-x-2 shadow-lg bg-background/95 backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
          <span>Exit</span>
        </Button>
      </div>
      
      <div className="w-full h-full pt-16">
        <iframe
          src={src}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
          title={`${config.label} Fullscreen Preview`}
        />
      </div>
    </div>
  );
};

export default FullscreenPreview;
