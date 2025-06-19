import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Maximize2, Minimize2, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer, { type FileNode } from './FileExplorer';
import CodeEditor from './CodeEditor';

type DeviceType = 'desktop' | 'tablet' | 'phone';

const PreviewCodePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  const deviceOrder: DeviceType[] = ['desktop', 'tablet', 'phone'];

  const cycleDevice = () => {
    const currentIndex = deviceOrder.indexOf(activeDevice);
    const nextIndex = (currentIndex + 1) % deviceOrder.length;
    setActiveDevice(deviceOrder[nextIndex]);
  };

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'phone':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceLabel = (device: DeviceType) => {
    return device.charAt(0).toUpperCase() + device.slice(1);
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
  };

  const iframeSrc = 'https://2037f7ae-5cce-45b4-87be-ee3f135a1be3.lovableproject.com/?__lovable_token=example-token';

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-foreground">Preview & Code</h3>
          <Badge variant="secondary" className="text-xs">
            {activeTab === 'preview' ? 'Live Preview' : 'Code Editor'}
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

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4 py-2 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-2 w-fit bg-background">
                <TabsTrigger value="preview" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              {activeTab === 'preview' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleDevice}
                  className="flex items-center space-x-2"
                >
                  {getDeviceIcon(activeDevice)}
                  <span>{getDeviceLabel(activeDevice)}</span>
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
            <div className="h-full w-full bg-muted/30 p-4 overflow-hidden rounded-xl border relative">
              <iframe
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
                className="min-h-full w-full flex-grow rounded-xl border"
                allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; payment; usb; vr; xr-spatial-tracking; screen-wake-lock; magnetometer; ambient-light-sensor; battery; gamepad; picture-in-picture; display-capture; bluetooth"
                src={iframeSrc}
                title="Live Preview"
              ></iframe>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <FileExplorer 
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile?.path || null}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} minSize={60}>
                <CodeEditor file={selectedFile} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreviewCodePanel;
