import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { useUser } from "@/context/UserContext";
import { fetchProjects, fetchProjectDetails } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Dashboard = () => {
  const { sessionid } = useParams<{ sessionid: string }>();
  const navigate = useNavigate();
  const { userIdea, setSessionId } = useUser();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(true);
  const [projectTitle, setProjectTitle] = useState<string>("");

  useEffect(() => {
    const validateAndLoadSession = async () => {
      if (!sessionid) {
        setIsValidating(false);
        return;
      }

      try {
        // First, check if user owns this session
        const userProjects = await fetchProjects();
        const ownsSession = userProjects.some(project => project.session_id === sessionid);
        
        if (!ownsSession) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have access to this project session.",
          });
          // Add delay to allow toast to show before navigation
          setTimeout(() => navigate('/projects'), 1000);
          return;
        }

        // Load session details and set as active session
        const projectDetails = await fetchProjectDetails(sessionid);
        setSessionId(sessionid);
        setProjectTitle(projectDetails.title || `Project ${sessionid.slice(0, 8)}`);
        
      } catch (error) {
        console.error('Error validating session:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project session.",
        });
        navigate('/projects');
      } finally {
        setIsValidating(false);
      }
    };

    validateAndLoadSession();
  }, [sessionid, setSessionId, navigate, toast]);

  if (isValidating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project session...</p>
        </div>
      </div>
    );
  }
  
  return (
    <MainDashboard 
      userIdea={projectTitle || userIdea || "My App"}
      sessionId={sessionid}
    />
  );
};

export default Dashboard;