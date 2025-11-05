import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Expand,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import FileExplorer, { type FileNode } from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import DevicePreview, { DeviceType } from "./DevicePreview";
import FullscreenPreview from "./FullscreenPreview";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

interface PreviewCodePanelProps {
  previewUrl?: string;
  sessionId?: string;
  selectedPage: FileNode | null;
}

const PreviewCodePanel = ({
  previewUrl,
  sessionId,
  selectedPage,
}: PreviewCodePanelProps) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [iframeSrc, setIframeSrc] = useState(previewUrl || "");
  const [fileContent, setFileContent] = useState([]);

  useEffect(() => {
    if (previewUrl) {
      setIframeSrc(previewUrl);
    }
  }, [previewUrl]);

  const hasValidPreview = iframeSrc && iframeSrc !== "";

  const handleFileSelect = (file: FileNode) => {
    console.log({ fileFromExp: file });

    setSelectedFile(file);
    setOriginalContent(file.content || "");
    setCurrentContent(file.content || "");
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (!sessionId) {
        return;
      }

      try {
        const response = await apiClient.get(
          `${API_ENDPOINTS.PROJECT.CODE}?session_id=${sessionId}`
        );

        if (response.data.files) {
          const filesWithContent = response.data.files.map(
            (file: { path: string; content: string }) => ({
              path: file.path,
              content: file.content,
            })
          );

          setFileContent(filesWithContent);
        }
      } catch (error) {
        setFileContent([]);
      }
    };

    fetchFiles();
  }, [sessionId]);

  
  useEffect(() => {
    console.log("Use effect working for selectedPage change");
    

    if (selectedPage) {

      const fileWithContent = fileContent.find(
        (f) => f.path === selectedPage.path
      );
      const fullFile = { ...selectedPage, ...fileWithContent };

      setOriginalContent(fileWithContent.content || "");
      handleFileSelect(fullFile);
      setShowCode(true);
    } else {
      // If it's null, reset everything
      setSelectedFile(null);
      setOriginalContent("");
      setCurrentContent("");
      setShowCode(false);
    }
  }, [selectedPage]);

  const toggleDevice = () => {
    const devices: DeviceType[] = ["desktop", "tablet", "phone"];
    const currentIndex = devices.indexOf(activeDevice);
    const nextIndex = (currentIndex + 1) % devices.length;
    setActiveDevice(devices[nextIndex]);
  };

  const handleCodeToggle = (checked: boolean) => {
    setShowCode(checked);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  };

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
  };

  const hasUnsavedChanges =
    originalContent !== currentContent && currentContent.trim() !== "";

  const handleSave = () => {
    setOriginalContent(currentContent);
    // TODO: implement actual save logic
  };

  const handleOpenInNewTab = () => {
    window.open(iframeSrc, "_blank");
  };

  const handleReload = () => {
    const url = new URL(iframeSrc);
    url.searchParams.set("_t", Date.now().toString());
    setIframeSrc(url.toString());
  };

  const getDeviceIcon = () => {
    switch (activeDevice) {
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      case "phone":
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
      {/* Header Bar */}
      <div className="px-3 py-2 border-b border-sidebar-border flex items-center justify-between bg-sidebar-background">
        {/* Left Side Buttons */}
        <div className="flex items-center space-x-2">
          {/* Toggle Code View */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCodeToggle(!showCode)}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                <Code className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle Code View / Preview</p>
            </TooltipContent>
          </Tooltip>

          {/* Save Button */}
          {showCode && hasUnsavedChanges && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Save Changes</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-2">
          {/* Open in New Tab */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Open in New Tab</p>
            </TooltipContent>
          </Tooltip>

          {/* Reload */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReload}
                className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Reload Preview</p>
            </TooltipContent>
          </Tooltip>

          {/* Device Toggle */}
          {!showCode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDevice}
                  className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
                >
                  {getDeviceIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Change Device View</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Fullscreen */}
          {!showCode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center justify-center h-8 w-8 p-0 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Fullscreen Preview</p>
              </TooltipContent>
            </Tooltip>
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
            <div className="h-full flex items-center justify-center bg-sidebar-background overflow-hidden relative">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large floating orbs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-float animate-delay-200" style={{ animationDuration: '4s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float animate-delay-300" style={{ animationDuration: '5s' }}></div>
                
                {/* Smaller floating particles */}
                <div className="absolute top-20 left-1/3 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float animate-delay-100" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-32 left-2/3 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-float animate-delay-400" style={{ animationDuration: '3.5s' }}></div>
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-accent/15 rounded-full blur-2xl animate-float animate-delay-500" style={{ animationDuration: '4.5s' }}></div>
                
                {/* Animated grid overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                  animation: 'float 8s ease-in-out infinite'
                }}></div>
              </div>
              
              <div className="text-center space-y-6 max-w-md px-6 relative z-10 animate-fade-up">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl animate-pulse-glow">
                  <Code className="w-12 h-12 text-primary animate-bounce-subtle" />
                </div>
                <h2 className="text-3xl font-bold text-sidebar-foreground animate-scale-in">
                  Welcome to Imagine.bo
                </h2>
                <p className="text-sidebar-foreground/70 text-lg animate-fade-in animate-delay-200">
                  Start a conversation with our AI to begin building your project.
                  Your preview will appear here once generated.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-sidebar-foreground/50 animate-fade-in animate-delay-300">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <span>Ready to create something amazing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
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
                    selectedPage={selectedPage}
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
