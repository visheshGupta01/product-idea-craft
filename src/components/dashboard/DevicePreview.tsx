
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
          container: "w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6",
          frame: "w-full max-w-full h-full bg-gray-800 rounded-t-xl shadow-2xl overflow-hidden relative",
          titleBar: "h-8 bg-gray-700 flex items-center px-4 space-x-2",
          dot: "w-3 h-3 rounded-full",
          iframe: "w-full h-[calc(100%-2rem)] border-0 bg-white"
        };
      case 'tablet':
        return {
          container: "w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6",
          frame: "w-full max-w-3xl h-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative",
          titleBar: "h-10 bg-gray-700 flex items-center px-4 space-x-2",
          dot: "w-3 h-3 rounded-full",
          iframe: "w-full h-[calc(100%-2.5rem)] border-0 bg-white"
        };
      case 'phone':
        return {
          container: "w-full h-full flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 p-2",
          frame: "w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl overflow-hidden relative border-2 border-gray-300",
          iframe: "w-full h-[calc(100vh-120px)] border-0 bg-white overflow-hidden"
        };
    }
  };

  const styles = getDeviceStyles();
  
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        {/* Desktop and Tablet title bar */}
        {(device === 'desktop' || device === 'tablet') && (
          <div className={styles.titleBar}>
            <div className={`${styles.dot} bg-red-500`} />
            <div className={`${styles.dot} bg-yellow-500`} />
            <div className={`${styles.dot} bg-green-500`} />
            <div className="flex-1" />
            <div className={`text-gray-300 font-medium ${device === 'tablet' ? 'text-sm' : 'text-xs'}`}>
              Preview - {config.label}
            </div>
            <div className="flex-1" />
          </div>
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
