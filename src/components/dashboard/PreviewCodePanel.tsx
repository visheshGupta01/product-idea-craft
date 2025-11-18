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
import { PinkLoadingDots } from "@/components/ui/pink-loading-dots";
import { cn } from "@/lib/utils";

interface PreviewCodePanelProps {
  previewUrl?: string;
  sessionId?: string;
  selectedPage: FileNode | null;
  isAiResponding?: boolean;
  isProcessingTools?: boolean;
}

const PreviewCodePanel = ({
  previewUrl,
  sessionId,
  selectedPage,
  isAiResponding = false,
  isProcessingTools = false,
}: PreviewCodePanelProps) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [iframeSrc, setIframeSrc] = useState(previewUrl || "");
  const [fileContent, setFileContent] = useState<
    { path: string; content: string }[]
  >([]);

  useEffect(() => {
    if (previewUrl) {
      setIframeSrc(previewUrl);
    }
  }, [previewUrl]);

  const hasValidPreview = iframeSrc && iframeSrc !== "";

  const handleFileSelect = (file: FileNode) => {
    // console.log({ fileFromExp: file });
    setSelectedFile(file);
    setOriginalContent(file.content || "");
    setCurrentContent(file.content || "");
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (!sessionId) return;
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
    // console.log("Use effect working for selectedPage change");

    if (selectedPage) {
      const fileWithContent = fileContent.find(
        (f) => f.path === selectedPage.path
      );
      const fullFile = { ...selectedPage, ...(fileWithContent || {}) };

      setOriginalContent(fileWithContent?.content || "");
      handleFileSelect(fullFile);
      setShowCode(true);
    } else {
      setSelectedFile(null);
      setOriginalContent("");
      setCurrentContent("");
      setShowCode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]); // we intentionally keep dependency to selectedPage only

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
    try {
      const url = new URL(iframeSrc);
      url.searchParams.set("_t", Date.now().toString());
      setIframeSrc(url.toString());
    } catch (e) {
      // fallback if iframeSrc isn't a valid URL
      setIframeSrc(previewUrl || iframeSrc);
    }
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
          {/* AI Responding Indicator */}
          {(isAiResponding || isProcessingTools) && (
            <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-md px-3 py-1.5 mr-2">
              <PinkLoadingDots />
              <span className="text-xs text-pink-500 font-medium">
                {isProcessingTools ? "Running tools..." : "AI responding..."}
              </span>
            </div>
          )}
          
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
          <div className="h-full animate-fade-in bg-white">
            <DevicePreview device={activeDevice} src={iframeSrc} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center overflow-hidden relative">
            <div className="text-center space-y-6 max-w-2xl px-6 relative z-10">
              <h2 className="text-4xl font-semibold text-white">
                Welcome to imagine.bo
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Start a conversation with our AI to begin building<br />
                your project. Your preview will appear here once<br />
                generated.
              </p>
              <div className="flex items-center justify-center gap-2 text-base text-white/80">
                <span>Ready to create something amazing</span>
              </div>
            </div>

            {/* Device Toggle - Bottom Right */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-lg p-2">
              <button
                onClick={() => setActiveDevice("desktop")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors",
                  activeDevice === "desktop" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Monitor className="h-4 w-4" />
                <span>Web</span>
              </button>
              <button
                onClick={() => setActiveDevice("phone")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors",
                  activeDevice === "phone" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mob</span>
              </button>
              <button
                onClick={() => setActiveDevice("tablet")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors",
                  activeDevice === "tablet" ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Tablet className="h-4 w-4" />
                <span>Tab</span>
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 ml-2 text-white/70 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCodePanel;
