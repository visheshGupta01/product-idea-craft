
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Maximize2, Minimize2, Smartphone, Tablet, Monitor } from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'phone';

const PreviewCodePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    phone: { width: '375px', height: '667px' }
  };

  const mockPreview = `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <header class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Your App Preview
          </h1>
          <p class="text-xl text-gray-600">
            This is how your app will look
          </p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 1</h3>
            <p class="text-gray-600">Description of your first feature</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 2</h3>
            <p class="text-gray-600">Description of your second feature</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 3</h3>
            <p class="text-gray-600">Description of your third feature</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const mockCode = `import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your App Preview
          </h1>
          <p className="text-xl text-gray-600">
            This is how your app will look
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;`;

  const DeviceButton = ({ device, icon: Icon, label }: { device: DeviceType, icon: any, label: string }) => (
    <Button
      variant={activeDevice === device ? "default" : "ghost"}
      size="sm"
      onClick={() => setActiveDevice(device)}
      className="flex items-center space-x-1"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold">Preview & Code</h3>
          <Badge variant="secondary" className="text-xs">
            Live Preview
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="px-4 pt-2 shrink-0">
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-2 w-fit">
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              {/* Device Preview Buttons - Only show on preview tab */}
              <div className="flex items-center space-x-1">
                <DeviceButton device="phone" icon={Smartphone} label="Phone" />
                <DeviceButton device="tablet" icon={Tablet} label="Tablet" />
                <DeviceButton device="desktop" icon={Monitor} label="Desktop" />
              </div>
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 m-0 p-4 overflow-hidden">
            <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">
              <div 
                className="bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  width: deviceSizes[activeDevice].width,
                  height: deviceSizes[activeDevice].height,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      </head>
                      <body>
                        ${mockPreview}
                      </body>
                    </html>
                  `}
                  className="w-full h-full"
                  title="App Preview"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0 p-4 overflow-auto">
            <div className="bg-muted rounded-lg p-4 h-full overflow-auto">
              <pre className="text-sm text-foreground">
                <code>{mockCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreviewCodePanel;
