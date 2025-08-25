import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { useUser } from "@/context/UserContext";
import { fetchProjectDetails } from "@/services/projectService";
import { SessionValidator } from "@/components/auth/SessionValidator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Dashboard = () => {
  const { sessionid } = useParams<{ sessionid: string }>();
  const { userIdea, setSessionId } = useUser();
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [isAccessValidated, setIsAccessValidated] = useState(false);

  const handleValidationComplete = async (isValid: boolean) => {
    if (isValid && sessionid) {
      setIsAccessValidated(true);
      try {
        // Load session details and set as active session
        const projectDetails = await fetchProjectDetails(sessionid);
        setSessionId(sessionid);
        setProjectTitle(projectDetails.title || `Project ${sessionid.slice(0, 8)}`);
      } catch (error) {
        console.error('Error loading project details:', error);
        setProjectTitle(`Project ${sessionid.slice(0, 8)}`);
      }
    }
  };

  // If no sessionid, render directly without validation
  if (!sessionid) {
    return (
      <MainDashboard 
        userIdea={userIdea || "My App"}
        sessionId={undefined}
      />
    );
  }

  return (
    <SessionValidator sessionId={sessionid} onValidationComplete={handleValidationComplete}>
      <MainDashboard 
        userIdea={projectTitle || userIdea || "My App"}
        sessionId={isAccessValidated ? sessionid : undefined}
      />
    </SessionValidator>
  );
};

export default Dashboard;