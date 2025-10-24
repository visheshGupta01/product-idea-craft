import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Expand, Monitor, Tablet, Smartphone, Save, Globe, ExternalLink, RefreshCw } from 'lucide-react';
  import { Switch } from '@/components/ui/switch';
  import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
  import FileExplorer, { type FileNode } from './FileExplorer';
  import CodeEditor from './CodeEditor';
  import DevicePreview, { DeviceType } from './DevicePreview';
  import FullscreenPreview from './FullscreenPreview';



interface PreviewCodePanelProps {
  previewUrl?: string;
  sessionId?: string;
}

const PreviewCodePanel = ({ previewUrl, sessionId }: PreviewCodePanelProps) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [iframeSrc, setIframeSrc] = useState(previewUrl || "");

  // Update iframe src when previewUrl changes
  useEffect(() => {
    if (previewUrl) {
      setIframeSrc(previewUrl);
    }
  }, [previewUrl]);

  const hasValidPreview = iframeSrc && iframeSrc !== "";

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

const handleOpenInNewTab = () => {
  window.open(iframeSrc, '_blank');
};

const handleReload = () => {
  // Force reload by adding a timestamp parameter
  const url = new URL(iframeSrc);
  url.searchParams.set('_t', Date.now().toString());
  setIframeSrc(url.toString());
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
      <div className="h-full flex flex-col bg-sidebar-background">
        <div className="px-3 py-2 border-b border-sidebar-border flex items-center justify-between bg-sidebar-background">
          {/* Left side buttons - Code toggle and Save */}
          <div className="flex items-center space-x-2">
            {/* Code toggle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCodeToggle(!showCode)}
              className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <Code className="w-4 h-4" />
            </Button>
            
            {/* Save button - only show when there are unsaved changes and in code view */}
            {showCode && hasUnsavedChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                <Save className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Right side buttons - Open in new tab, Reload, Device toggle and Fullscreen */}
          <div className="flex items-center space-x-2">
            {/* Open in new tab button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            {/* Reload button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReload}
              className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            {/* Device toggle - only show icon, no text */}
            {!showCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDevice}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                {getDeviceIcon()}
              </Button>
            )}
            
            {/* Fullscreen button */}
            {!showCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
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
            <div className="h-full animate-fade-in bg-sidebar-background">
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                  <div className="h-full bg-sidebar-background">
                    <FileExplorer
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile?.path || null}
                      sessionId={sessionId}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-sidebar-border" />
                <ResizablePanel defaultSize={75} minSize={60}>
                  <div className="h-full bg-sidebar-background">
                    <CodeEditor 
                      file={selectedFile} 
                      onContentChange={handleContentChange}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          ) : hasValidPreview ? (
            <div className="h-full animate-fade-in bg-sidebar-background">
              <DevicePreview device={activeDevice} src={iframeSrc} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-sidebar-background">
              <div className="text-center space-y-4 max-w-md px-6">
                <h2 className="text-3xl font-bold text-sidebar-foreground">
                  Welcome to Imagine.bo
                </h2>
                <p className="text-sidebar-foreground/70">
                  Start a conversation with our AI to begin building your project.
                  Your preview will appear here once generated.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PreviewCodePanel;
