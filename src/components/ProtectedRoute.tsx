
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userIdea, isProcessingIdea, initialResponse, isAuthenticated, sessionId } = useUser();

  // Allow access if user is authenticated and has a session
  if (!isAuthenticated || (!userIdea && !isProcessingIdea && !initialResponse && !sessionId)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
