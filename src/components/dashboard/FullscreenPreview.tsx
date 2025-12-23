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
  onClose,
}) => {
  const config = deviceConfigs[device];

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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

  // Scale the device to fit viewport
const getScaledDimensions = () => {
  if (device === 'desktop') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  // For tablet and phone, scale to fit viewport while preserving aspect ratio
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.8;
  const widthRatio = maxWidth / config.width;
  const heightRatio = maxHeight / config.height;
  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: config.width * scale,
    height: config.height * scale,
  };
};


  const { width, height } = getScaledDimensions();

  const getControlsPosition = () => {
    return device === 'desktop'
      ? 'fixed top-6 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-2'
      : 'fixed top-3 left-1/2 transform -translate-x-1/2 z-60 flex items-center gap-1';
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      {/* Floating Controls */}
      <div className={getControlsPosition()}>
        <div
          className={`bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg ${
            device === 'desktop' ? 'px-3 py-1.5' : 'px-2 py-1'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDevice}
            className={`flex items-center space-x-1.5 ${
              device === 'desktop' ? 'h-7 px-2' : 'h-6 px-1.5'
            }`}
          >
            {getDeviceIcon()}
            <span
              className={`capitalize font-medium ${
                device === 'desktop' ? 'text-xs' : 'text-[10px]'
              }`}
            >
              {device}
            </span>
            {device === 'desktop' && (
              <span className="text-xs opacity-60">
                {config.width}×{config.height}
              </span>
            )}
          </Button>
        </div>

        <div
          className={`bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg ${
            device === 'desktop' ? 'px-2.5 py-1.5' : 'px-1.5 py-1'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`flex items-center space-x-1 ${
              device === 'desktop' ? 'h-7 px-2' : 'h-6 px-1.5'
            }`}
          >
            <X className="w-3 h-3" />
            <span className={`${device === 'desktop' ? 'text-xs' : 'text-[10px]'}`}>
              Exit
            </span>
          </Button>
        </div>
      </div>

      {/* Preview Container */}
<div
  style={{
    width,
    height,
    backgroundColor: device === 'desktop' ? 'transparent' : 'white',
    borderRadius: device === 'desktop' ? 0 : device === 'tablet' ? 16 : 24,
    boxShadow: device === 'desktop' ? 'none' : '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    display: 'flex',
  }}
>

        <iframe
  src={src}
  style={{ width: '100%', height: '100%', border: 0 }}
  sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock allow-popups"
  title={`${config.label} Fullscreen Preview`}
/>

      </div>
    </div>
  );
};

export default FullscreenPreview;
