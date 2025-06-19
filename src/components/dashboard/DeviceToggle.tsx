
import React from 'react';
import { Button } from '@/components/ui/button';
import { DeviceType, deviceConfigs } from './DevicePreview';

interface DeviceToggleProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  className?: string;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ 
  activeDevice, 
  onDeviceChange, 
  className = '' 
}) => {
  const devices: DeviceType[] = ['desktop', 'tablet', 'phone'];
  
  return (
    <div className={`flex items-center space-x-1 bg-muted rounded-lg p-1 ${className}`}>
      {devices.map((device) => {
        const config = deviceConfigs[device];
        const isActive = activeDevice === device;
        
        return (
          <Button
            key={device}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceChange(device)}
            className={`flex items-center space-x-2 px-3 py-2 h-8 ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-muted-foreground/10'
            }`}
          >
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
            <span className="text-xs opacity-60">
              {config.width}×{config.height}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default DeviceToggle;
