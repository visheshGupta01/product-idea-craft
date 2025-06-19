
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Expand } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileExplorer, { type FileNode } from './FileExplorer';
import CodeEditor from './CodeEditor';
import DevicePreview, { DeviceType } from './DevicePreview';
import DeviceToggle from './DeviceToggle';
import FullscreenPreview from './FullscreenPreview';

const PreviewCodePanel = () => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showCode, setShowCode] = useState(false);
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

  if (showCode) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Simple header with back button */}
        <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode(false)}
            className="flex items-center space-x-2"
          >
            <span>← Back to Preview</span>
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
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
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Minimal controls */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-background">
        <DeviceToggle 
          activeDevice={activeDevice}
          onDeviceChange={setActiveDevice}
        />
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(true)}
            className="flex items-center space-x-1.5"
          >
            <Code className="w-4 h-4" />
            <span>Code</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center space-x-1.5"
          >
            <Expand className="w-4 h-4" />
            <span>Fullscreen</span>
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-hidden">
        <DevicePreview
          device={activeDevice}
          src={iframeSrc}
        />
      </div>
    </div>
  );
};

export default PreviewCodePanel;
