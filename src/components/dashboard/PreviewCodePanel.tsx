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
  Github,
  Rocket,
  User,
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
      {/* Preview Navbar */}
      <div className="h-14 px-4 border-b border-[#2A2A2A] flex items-center justify-between bg-[#252525]">
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span className="text-sm">Preview</span>
        </button>

        <div className="flex items-center space-x-3">
          {sessionId && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9 px-4 text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <User className="h-4 w-4" />
              Assign to Dev
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-9 px-4 text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Github className="h-4 w-4" />
            Github
          </Button>

          <Button
            size="sm"
            className="flex items-center gap-2 h-9 px-5 bg-[#FF00A9] text-white hover:bg-[#E000A0] font-medium rounded-md"
          >
            <Rocket className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
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
