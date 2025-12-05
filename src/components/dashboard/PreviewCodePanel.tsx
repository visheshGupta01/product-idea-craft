import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CodeXml,
  Expand,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  ExternalLink,
  RefreshCw,
  Rocket,
  User,
  Github,
  ChevronDown,
  Route,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import AssignToDeveloper from "./AssignToDeveloper";
import GitHubIntegration from "./GitHubIntegration";
import VercelIntegration from "./VercelIntegration";

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
  const [routes, setRoutes] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState("/");
  const [iframeSrc, setIframeSrc] = useState(previewUrl || "");
  const [fileContent, setFileContent] = useState<
    { path: string; content: string }[]
  >([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setIframeSrc(previewUrl);
    }
  }, [previewUrl]);
  //<CodeXml />
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

  // Fetch routes when sessionId changes
  useEffect(() => {
    const fetchRoutes = async () => {
      if (!sessionId) return;
      try {
        const response = await apiClient.get(
          `/api/chat/pages-routes?session_id=${sessionId}`
        );
        if (response.data.success && response.data.routes) {
          setRoutes(response.data.routes);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        setRoutes([]);
      }
    };
    fetchRoutes();
  }, [sessionId]);

  const handleRouteChange = (route: string) => {
    setCurrentRoute(route);
    if (previewUrl) {
      try {
        const url = new URL(previewUrl);
        url.pathname = route;
        url.searchParams.set("_t", Date.now().toString());
        setIframeSrc(url.toString());
      } catch (e) {
        // fallback: append route to previewUrl
        const baseUrl = previewUrl.split("?")[0].replace(/\/$/, "");
        setIframeSrc(`${baseUrl}${route}?_t=${Date.now()}`);
      }
    }
  };

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
    <>
      {/* Dialogs */}
      {sessionId && (
        <AssignToDeveloper
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          sessionId={sessionId}
        />
      )}

      <Dialog open={showGithubModal} onOpenChange={setShowGithubModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Integration
            </DialogTitle>
          </DialogHeader>
          <GitHubIntegration />
        </DialogContent>
      </Dialog>

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Deploy to Vercel
            </DialogTitle>
          </DialogHeader>
          <VercelIntegration />
        </DialogContent>
      </Dialog>

      <div className="h-full flex flex-col bg-sidebar-background overflow-hidden">
        {/* Preview Navbar */}
        <div className="h-14 min-h-[3.5rem] px-2 border-b border-[#2A2A2A] flex items-center justify-between bg-[#252525] flex-shrink-0">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCodeToggle(!showCode)}
                    className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <CodeXml className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Code View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReload}
                    disabled={!hasValidPreview}
                    className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh Preview</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    disabled={!hasValidPreview}
                    className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Preview in New Tab</TooltipContent>
              </Tooltip>
            </div>
            {/* Routes Dropdown */}
            {routes.length > 0 && hasValidPreview && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-800 gap-1"
                  >
                    <Route className="h-3.5 w-3.5" />
                    <span className="max-w-[100px] truncate">
                      {currentRoute}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-[#252525] border-[#2A2A2A] max-h-[300px] overflow-y-auto z-50"
                >
                  {routes.map((route) => (
                    <DropdownMenuItem
                      key={route}
                      onClick={() => handleRouteChange(route)}
                      className={cn(
                        "text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer",
                        currentRoute === route && "bg-gray-700 text-white"
                      )}
                    >
                      {route}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="flex items-center gap-2">
              {sessionId && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAssignModal(true)}
                      className="h-8 px-2 bg-transparent border-none text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <User className="h-3.5 w-3.5" />
                      Assign to Dev
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Assign to Developer</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGithubModal(true)}
                    className="h-8 px-2 bg-transparent border-none  text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Github
                  </Button>
                </TooltipTrigger>
                <TooltipContent>GitHub Integration</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => setShowPublishModal(true)}
                    className="h-8 px-2 bg-[#FF00A9] text-white hover:bg-[#E000A0] rounded-2xl"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    Publish
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Publish to Vercel</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
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
            <div className="h-full animate-fade-in bg-white relative pt-14 md:pt-0">
              <DevicePreview device={activeDevice} src={iframeSrc} />

              {/* Device Toggle - Center Bottom */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-1.5 z-10">
                <button
                  onClick={() => setActiveDevice("desktop")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "desktop"
                      ? "bg-[#FF00A9] text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Web</span>
                </button>
                <button
                  onClick={() => setActiveDevice("phone")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "phone"
                      ? "bg-[#FF00A9] text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mob</span>
                </button>
                <button
                  onClick={() => setActiveDevice("tablet")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "tablet"
                      ? "bg-[#FF00A9] text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Tablet className="h-3.5 w-3.5" />
                  <span>Tab</span>
                </button>
              </div>

              {/* Fullscreen Button - Bottom Right */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-6 right-6 p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/70 hover:text-white transition-colors z-10"
                title="Fullscreen"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="neon-bg h-full flex items-center justify-center overflow-hidden relative">
              <div className="text-center space-y-6 max-w-2xl px-6 relative z-10">
                <h2 className="text-4xl font-semibold text-white">
                  Welcome to imagine.bo
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Start a conversation with our AI to begin building
                  <br />
                  your project. Your preview will appear here once
                  <br />
                  generated.
                </p>
                <div className="flex items-center justify-center gap-2 text-base text-white/80">
                  <span>Ready to create something amazing</span>
                </div>
              </div>

              {/* Device Toggle - Center Bottom */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg p-1.5">
                <button
                  onClick={() => setActiveDevice("desktop")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "desktop"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Web</span>
                </button>
                <button
                  onClick={() => setActiveDevice("phone")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "phone"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mob</span>
                </button>
                <button
                  onClick={() => setActiveDevice("tablet")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors",
                    activeDevice === "tablet"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <Tablet className="h-3.5 w-3.5" />
                  <span>Tab</span>
                </button>
              </div>

              {/* Fullscreen Button - Bottom Right */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-6 right-6 p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white/70 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PreviewCodePanel;
