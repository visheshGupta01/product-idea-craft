
import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export type DeviceType = 'desktop' | 'tablet' | 'phone';

interface DeviceConfig {
  width: number;
  height: number;
  label: string;
  icon: React.ReactNode;
}

export const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  desktop: {
    width: 1280,
    height: 800,
    label: 'Desktop',
    icon: <Monitor className="w-4 h-4" />
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'Tablet',
    icon: <Tablet className="w-4 h-4" />
  },
  phone: {
    width: 414,
    height: 896,
    label: 'Phone',
    icon: <Smartphone className="w-4 h-4" />
  }
};

interface DevicePreviewProps {
  device: DeviceType;
  src: string;
}
const getScaledDimensions = (device: DeviceType) => {
  const config = deviceConfigs[device];
  const maxWidth = window.innerWidth * 1; // max 90% of screen width
  const maxHeight = window.innerHeight * 0.9; // max 80% of screen height

  const widthRatio = maxWidth / config.width;
  const heightRatio = maxHeight / config.height;
  const scale = Math.min(widthRatio, heightRatio, 1); // scale down if necessary

  return {
    width: config.width * scale,
    height: config.height * scale,
  };
};

const DevicePreview: React.FC<DevicePreviewProps> = ({ device, src }) => {
  const { width, height } = getScaledDimensions(device);

  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div
        style={{
          width,
          height,
          backgroundColor: 'white',
          borderRadius: device === 'desktop' ? 0 : device === 'tablet' ? 16 : 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={src}
          style={{ width: '100%', height: '100%', border: 0 }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock allow-popups"
          title={`${deviceConfigs[device].label} Preview`}
        />
      </div>
    </div>
  );
};


export default DevicePreview;
