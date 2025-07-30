
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userIdea, isProcessingIdea, initialMcpResponse } = useUser();

  // Allow access if user has an idea, is processing an idea, or has an initial response
  if (!userIdea && !isProcessingIdea && !initialMcpResponse) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
