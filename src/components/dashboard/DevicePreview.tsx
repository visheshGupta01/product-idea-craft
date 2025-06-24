
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
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  
  React.useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      if (device === 'desktop') {
        // For desktop, fit width and maintain aspect ratio
        const scaleX = containerWidth / config.width;
        const scaleY = (containerHeight - 20) / config.height; // Small vertical padding
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(Math.max(newScale, 0.1));
      } else {
        // For tablet and phone, fill width completely and scale height proportionally
        const scaleX = containerWidth / config.width;
        const scaleY = (containerHeight - 20) / config.height;
        const newScale = Math.min(scaleX, scaleY);
        setScale(Math.max(newScale, 0.1));
      }
    };
    
    updateScale();
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [config.width, config.height, device]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-muted/20"
    >
      <div 
        className="relative bg-background rounded-lg shadow-lg border border-border overflow-hidden transition-transform duration-300"
        style={{
          width: config.width,
          height: config.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Device frame decorations */}
        {device === 'phone' && (
          <>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-muted rounded-full z-10" />
          </>
        )}
        
        {device === 'tablet' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-muted rounded-full z-10" />
        )}
        
        <iframe
          src={src}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
          allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
          title={`${config.label} Preview`}
        />
      </div>
    </div>
  );
};

export default DevicePreview;
