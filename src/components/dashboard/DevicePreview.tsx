
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
          container: "w-full h-full flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 pt-8 pb-4 px-4",
          frame: "w-80 max-w-sm bg-black rounded-[2rem] p-1.5 shadow-2xl relative",
          notch: "absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-black rounded-full z-20",
          homeIndicator: "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full",
          iframe: "w-full h-[560px] border-0 rounded-[1.5rem] bg-white overflow-hidden"
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
        
        {/* Phone notch */}
        {device === 'phone' && (
          <div className={styles.notch} />
        )}
        
        <iframe
          src={src}
          className={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
          title={`${config.label} Preview`}
        />
        
        {/* Phone home indicator */}
        {device === 'phone' && (
          <div className={styles.homeIndicator} />
        )}
      </div>
    </div>
  );
};

export default DevicePreview;
