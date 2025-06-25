
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
        return <Monitor className="w-3 h-3" />;
      case 'tablet':
        return <Tablet className="w-3 h-3" />;
      case 'phone':
        return <Smartphone className="w-3 h-3" />;
    }
  };
  
  const getPreviewContainerStyles = () => {
    switch (device) {
      case "desktop":
        return "w-full h-full";
      case "tablet":
        return "w-full h-full flex items-center justify-center p-8 pt-16";
      case "phone":
        return "w-full h-full flex items-center justify-center p-8 pt-16";
    }
  };

  const getIframeStyles = () => {
    switch (device) {
      case "desktop":
        return "w-full h-full border-0";
      case "tablet":
        return "w-[768px] h-[600px] border-0 rounded-xl shadow-2xl bg-white max-w-full max-h-full";
      case "phone":
        return "w-[375px] h-[667px] border-0 rounded-[2rem] shadow-2xl bg-white max-w-full max-h-full";
    }
  };

  const getControlsPosition = () => {
    switch (device) {
      case "desktop":
        return "fixed top-6 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-2";
      case "tablet":
      case "phone":
        return "fixed top-3 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-1";
    }
  };

  const getControlsSize = () => {
    return device === "desktop" ? "default" : "compact";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Floating Controls */}
      <div className={getControlsPosition()}>
        <div
          className={`bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg ${
            device === "desktop" ? "px-3 py-1.5" : "px-2 py-1"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDevice}
            className={`flex items-center space-x-1.5 ${
              device === "desktop" ? "h-7 px-2" : "h-6 px-1.5"
            }`}
          >
            {getDeviceIcon()}
            <span
              className={`capitalize font-medium ${
                device === "desktop" ? "text-xs" : "text-[10px]"
              }`}
            >
              {device}
            </span>
            {device === "desktop" && (
              <span className="text-xs opacity-60">
                {config.width}×{config.height}
              </span>
            )}
          </Button>
        </div>

        <div
          className={`bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg ${
            device === "desktop" ? "px-2.5 py-1.5" : "px-1.5 py-1"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`flex items-center space-x-1 ${
              device === "desktop" ? "h-7 px-2" : "h-6 px-1.5"
            }`}
          >
            <X className="w-3 h-3" />
            <span
              className={`${device === "desktop" ? "text-xs" : "text-[10px]"}`}
            >
              Exit
            </span>
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className={getPreviewContainerStyles()}>
        <iframe
          src={src}
          className={getIframeStyles()}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
          title={`${config.label} Fullscreen Preview`}
        />
      </div>
    </div>
  );
};

export default FullscreenPreview;
