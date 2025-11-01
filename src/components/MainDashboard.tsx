import React, { useState, useEffect } from "react";
import Sidebar from "./dashboard/Sidebar";
import ChatPanel from "./dashboard/ChatPanel";
import PreviewCodePanel from "./dashboard/PreviewCodePanel";
import TeamPage from "./dashboard/TeamPage";
import MyProjectsPage from "./dashboard/MyProjectsPage";
import Navbar from "./ui/navbar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useUser } from "@/context/UserContext";
import { fetchProjectDetails, ProjectDetails } from "@/services/projectService";

interface MainDashboardProps {
  userIdea: string;
  sessionId?: string;
  deployUrl?: string;
  shouldOpenPreview?: boolean;
}

type ActiveView = "main" | "team" | "my-projects";

const MainDashboard = ({
  userIdea,
  sessionId,
  deployUrl,
  shouldOpenPreview,
}: MainDashboardProps) => {
  const [activeView, setActiveView] = useState<ActiveView>("main");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentProject] = useState({
    id: "1",
    name: "My App Idea",
    description: userIdea,
    status: "in-progress",
  });
  const [projectDetails, setProjectDetails] = useState<
    ProjectDetails | undefined
  >();

  const { initialResponse } = useUser();

  // Track if frontend creation task is completed (task id 6: "First Draft Generated")
  const [isFrontendCreated, setIsFrontendCreated] = useState(
    shouldOpenPreview || false
  );
  const [previewUrl, setPreviewUrl] = useState<string>(deployUrl || "");

  // Fetch project details when sessionId changes and check for stored project URL
  useEffect(() => {
    const loadProjectDetails = async () => {
      if (sessionId) {
        try {
          //console.log('📝 Fetching project details for sessionId:', sessionId);
          const details = await fetchProjectDetails(sessionId);
          //console.log('📝 Project details fetched:', details);
          setProjectDetails(details);

          // Only show preview for current session if it has a project URL
          if (details.project_url) {
            setPreviewUrl(details.project_url);
            setIsFrontendCreated(true);
            //console.log('🚀 Auto-setting preview from project details:', details.project_url);
          } else {
            // Clear preview when switching to a chat without project_url
            setPreviewUrl("");
            setIsFrontendCreated(false);
            //console.log('🚀 Clearing preview - no project URL for this session');
          }
        } catch (error) {
          //console.error("📝 Failed to fetch project details:", error);
        }
      } else {
        setProjectDetails(undefined);
        setPreviewUrl("");
        setIsFrontendCreated(false);
      }
    };

    loadProjectDetails();
  }, [sessionId]);

  // Auto-collapse sidebar on non-main screens and reset to main view when sessionId changes
  useEffect(() => {
    if (activeView !== "main") {
      setSidebarCollapsed(true);
    }
  }, [activeView]);

  // Reset to main view when sessionId changes (coming from project selection)
  useEffect(() => {
    if (sessionId) {
      setActiveView("main");
    }
  }, [sessionId]);

  useEffect(() => {
    const handleFrontendComplete = () => {
      setIsFrontendCreated(true);
    };

    window.addEventListener("frontendComplete", handleFrontendComplete);
    return () =>
      window.removeEventListener("frontendComplete", handleFrontendComplete);
  }, []);

  const handleFrontendGenerated = async (url: string) => {
    setPreviewUrl(url);
    setIsFrontendCreated(true);
    //console.log("🎯 Preview URL set:", url);
    
    // Refresh project details to update sitemap
    if (sessionId) {
      try {
        const details = await fetchProjectDetails(sessionId);
        setProjectDetails(details);
        //console.log("🗺️ Sitemap refreshed:", details);
      } catch (error) {
        //console.error("Failed to refresh sitemap:", error);
      }
    }
  };

  const handleSitemapGenerated = (sitemap: any) => {
    //console.log("🗺️ Sitemap generated, updating sidebar:", sitemap);
    
    // Update project details with the new sitemap
    if (projectDetails) {
      setProjectDetails({
        ...projectDetails,
        sitemap: sitemap,
      });
    } else {
      // If no project details yet, create a minimal object
      setProjectDetails({
        title: sitemap.project_name || "Untitled Project",
        sitemap: sitemap,
      } as ProjectDetails);
    }
  };

  const handlePublish = () => {
    // Handle publish functionality
    //console.log('Publishing app...');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "team":
        return <TeamPage />;
      case "my-projects":
        return <MyProjectsPage />;
      default:
        // Always show split view with chat and preview panels
        return (
          <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-w-0"
          >
            {/* AI Chat Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 40 : 35}
              minSize={25}
              maxSize={75}
              className="hidden lg:block"
            >
              <div className="h-full border-r border-border">
                <ChatPanel
                  userIdea={userIdea}
                  onFrontendGenerated={handleFrontendGenerated}
                  onSitemapGenerated={handleSitemapGenerated}
                  sessionId={sessionId}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="hidden lg:flex" />

            {/* Preview/Code Panel */}
            <ResizablePanel
              defaultSize={sidebarCollapsed ? 30 : 35}
              minSize={30}
            >
              <div className="h-full bg-background">
                <PreviewCodePanel
                  previewUrl={previewUrl}
                  sessionId={sessionId}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Fixed Navbar - only show on main dashboard */}
      <Navbar
        onPublish={handlePublish}
        isFrontendCreated={isFrontendCreated}
        sessionId={sessionId}
      />

      {/* Main content with conditional top padding for navbar */}
      <div className="h-full pt-14 flex">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-16" : "w-64"
          } flex-shrink-0`}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              // Only allow toggle on main dashboard, keep collapsed on other screens
              if (activeView === "main") {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            currentProject={currentProject}
            activeView={activeView}
            onViewChange={setActiveView}
            projectDetails={projectDetails}
            sessionId={sessionId}
            onProjectRenamed={async (newTitle) => {
              if (projectDetails && sessionId) {
                setProjectDetails({ ...projectDetails, title: newTitle });
                // Refresh project details to get updated preview URL
                try {
                  const details = await fetchProjectDetails(sessionId);
                  setProjectDetails(details);
                  if (details.project_url) {
                    setPreviewUrl(details.project_url);
                  }
                } catch (error) {
                  //console.error("Failed to refresh project details:", error);
                }
              }
            }}
          />
        </div>

        {/* Main Content Area - takes remaining space */}
        <div className="flex-1 min-w-0">{renderActiveView()}</div>
      </div>
    </div>
  );
};

export default MainDashboard;
