
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { userIdea, isProcessingIdea, initialResponse, isAuthenticated, sessionId, userType } = useUser();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check user type if specified
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect admin to admin dashboard, user to regular dashboard
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userType === 'user') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // For regular dashboard, also check if user has a session
  if (requiredUserType === 'user' && (!userIdea && !isProcessingIdea && !initialResponse && !sessionId)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
