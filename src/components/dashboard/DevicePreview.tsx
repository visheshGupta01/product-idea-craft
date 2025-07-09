
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
    height: 600,
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
          container: "w-full h-full flex items-center justify-center bg-background",
          frame: "w-full max-w-full h-full bg-white shadow-2xl overflow-hidden relative",
          iframe: "w-full h-full border-0 bg-white"
        };
      case 'tablet':
        return {
          container: "w-full h-full flex items-center justify-center bg-background p-6 overflow-hidden",
          frame: "w-[768px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden relative flex-shrink-0",
          iframe: "w-full h-full mt-6 border-0 bg-white"
        };
      case 'phone':
        return {
          container: "w-full h-full flex items-center justify-center bg-background p-2",
          frame: "w-full max-w-sm mx-auto rounded-lg shadow-2xl overflow-hidden relative",
          iframe: "w-full h-[calc(100vh-45px)] border-0 overflow-hidden"
        };
    }
  };

  const styles = getDeviceStyles();
  
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <iframe
          key={src} // Use src as key so it only remounts when URL changes, not device
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
