import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { useUser } from "@/context/UserContext";
import { SessionValidator } from "@/components/auth/SessionValidator";

const Dashboard = () => {
  const { sessionid } = useParams<{ sessionid: string }>();
  const location = useLocation();
  const { userIdea, setSessionId } = useUser();
  const [isAccessValidated, setIsAccessValidated] = useState(false);

  // Get deploy URL and preview flag from navigation state
  const deployUrl = location.state?.deployUrl;
  const shouldOpenPreview = location.state?.shouldOpenPreview;

  const handleValidationComplete = async (isValid: boolean) => {
    if (isValid && sessionid) {
      setIsAccessValidated(true);
      setSessionId(sessionid);
    }
  };

  // If no sessionid, render directly without validation
  if (!sessionid) {
    return (
      <MainDashboard
        userIdea={userIdea || "My App"}
        sessionId={undefined}
        deployUrl={deployUrl}
        shouldOpenPreview={shouldOpenPreview}
      />
    );
  }

  return (
    <SessionValidator
      sessionId={sessionid}
      onValidationComplete={handleValidationComplete}
    >
      <MainDashboard
        userIdea={userIdea || "My App"}
        sessionId={isAccessValidated ? sessionid : undefined}
        deployUrl={deployUrl}
        shouldOpenPreview={shouldOpenPreview}
      />
    </SessionValidator>
  );
};

export default Dashboard;
