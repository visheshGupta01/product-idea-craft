import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Expand, Monitor, Tablet, Smartphone, Save, Globe } from 'lucide-react';
  import { Switch } from '@/components/ui/switch';
  import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
  import FileExplorer, { type FileNode } from './FileExplorer';
  import CodeEditor from './CodeEditor';
  import DevicePreview, { DeviceType } from './DevicePreview';
  import FullscreenPreview from './FullscreenPreview';



const PreviewCodePanel = () => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [iframeSrc, setIframeSrc] = useState(
    "https://94153f317dee.ngrok-free.app/"
  );

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
    setOriginalContent(file.content || '');
    setCurrentContent(file.content || '');
  };

    const toggleDevice = () => {
      const devices: DeviceType[] = ["desktop", "tablet", "phone"];
      const currentIndex = devices.indexOf(activeDevice);
      const nextIndex = (currentIndex + 1) % devices.length;
      setActiveDevice(devices[nextIndex]);
    };

const handleCodeToggle = (checked: boolean) => {
  setShowCode(checked); // update state immediately
  setIsTransitioning(true); // still fade out/in for animation
  setTimeout(() => {
    setIsTransitioning(false);
  }, 150);
};

const handleContentChange = (newContent: string) => {
  setCurrentContent(newContent);
};

const hasUnsavedChanges = originalContent !== currentContent && currentContent.trim() !== '';

const handleSave = () => {
  setOriginalContent(currentContent);
  // In a real implementation, this would save the file content
};

const handlePublish = () => {
  // Implement publish logic here
  window.open('https://docs.lovable.dev/user-guides/deploying', '_blank');
};


    const getDeviceIcon = () => {
      switch (activeDevice) {
        case 'desktop':
          return <Monitor className="w-4 h-4" />;
        case 'tablet':
          return <Tablet className="w-4 h-4" />;
        case 'phone':
          return <Smartphone className="w-4 h-4" />;
      }
    };

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
      <div className="h-full flex flex-col bg-background">
        <div className="px-3 py-1.5 border-b border-border flex items-center justify-between bg-background">
          {showCode ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCodeToggle(false)}
              className="flex items-center space-x-2 text-foreground font-poppins"
            >
              <span>← Back to Preview</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDevice}
              className="flex items-center space-x-2 h-8 font-poppins"
            >
              {getDeviceIcon()}
              <span className="capitalize text-xs">{activeDevice}</span>
            </Button>
          )}

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <Switch checked={showCode} onCheckedChange={handleCodeToggle} />
            </div>
            {showCode && hasUnsavedChanges && (
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="flex items-center space-x-1.5 h-8 font-poppins"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublish}
              className="flex items-center space-x-1.5 h-8 font-poppins"
            >
              <Globe className="w-4 h-4" />
              <span>Publish</span>
            </Button>
            {!showCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center space-x-1.5 h-8 font-poppins"
              >
                <Expand className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div
          className={`flex-1 overflow-hidden transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {showCode ? (
            <div className="h-full animate-fade-in">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <FileExplorer
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile?.path || null}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75} minSize={60}>
                  <CodeEditor 
                    file={selectedFile} 
                    onContentChange={handleContentChange}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          ) : (
            <div className="h-full animate-fade-in">
              <DevicePreview device={activeDevice} src={iframeSrc} />
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PreviewCodePanel;
