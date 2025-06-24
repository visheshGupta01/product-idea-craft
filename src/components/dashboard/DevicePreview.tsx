
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
    width: 375,
    height: 667,
    label: 'Phone',
    icon: <Smartphone className="w-4 h-4" />
  }
};

interface DevicePreviewProps {
  device: DeviceType;
  src: string;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ device, src }) => {
  const config = deviceConfigs[device];
  
  const getDeviceStyles = () => {
    switch (device) {
      case 'desktop':
        return {
          container: "w-full h-full flex items-center justify-center bg-gray-100 p-4",
          frame: "w-full max-w-full h-full bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden",
          iframe: "w-full h-full border-0 rounded-lg"
        };
      case 'tablet':
        return {
          container: "w-full h-full flex items-center justify-center bg-gray-100 p-8",
          frame: "w-80 h-[600px] bg-black rounded-[2rem] p-4 shadow-2xl",
          iframe: "w-full h-full border-0 rounded-[1.5rem] bg-white"
        };
      case 'phone':
        return {
          container: "w-full h-full flex items-center justify-center bg-gray-100 p-8",
          frame: "w-72 h-[600px] bg-black rounded-[2.5rem] p-3 shadow-2xl relative",
          iframe: "w-full h-full border-0 rounded-[2rem] bg-white"
        };
    }
  };

  const styles = getDeviceStyles();
  
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        {/* Phone notch */}
        {device === 'phone' && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black rounded-full z-10" />
        )}
        
        <iframe
          src={src}
          className={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
          title={`${config.label} Preview`}
        />
      </div>
    </div>
  );
};

export default DevicePreview;
