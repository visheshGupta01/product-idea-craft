
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Maximize2, Minimize2, Expand } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer, { type FileNode } from './FileExplorer';
import CodeEditor from './CodeEditor';
import DevicePreview, { DeviceType } from './DevicePreview';
import DeviceToggle from './DeviceToggle';
import FullscreenPreview from './FullscreenPreview';

const PreviewCodePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
  };

  const iframeSrc = 'https://2037f7ae-5cce-45b4-87be-ee3f135a1be3.lovableproject.com/?__lovable_token=example-token';

  if (isFullscreen) {
    return (
      <FullscreenPreview
        device={activeDevice}
        onDeviceChange={setActiveDevice}
        src={iframeSrc}
        onClose={() => setIsFullscreen(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Compact header */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm text-foreground">Preview & Code</h3>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {activeTab === 'preview' ? 'Live' : 'Editor'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 w-7 p-0"
        >
          {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Compact tab controls */}
          <div className="px-3 py-1.5 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center justify-between">
              <TabsList className="h-8 grid grid-cols-2 w-fit bg-background p-0.5">
                <TabsTrigger 
                  value="preview" 
                  className="flex items-center space-x-1.5 text-xs px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="code" 
                  className="flex items-center space-x-1.5 text-xs px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              {activeTab === 'preview' && (
                <div className="flex items-center space-x-2">
                  <DeviceToggle 
                    activeDevice={activeDevice}
                    onDeviceChange={setActiveDevice}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center space-x-1.5 h-8 px-3"
                  >
                    <Expand className="w-3.5 h-3.5" />
                    <span className="text-xs">Fullscreen</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
            <div className="h-full w-full">
              <DevicePreview
                device={activeDevice}
                src={iframeSrc}
              />
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
