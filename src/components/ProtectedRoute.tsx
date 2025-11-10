
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/authService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDeveloper?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireDeveloper = false 
}) => {
  const { userIdea, isProcessingIdea, initialResponse, isAuthenticated, sessionId, userRole, isLoading } = useUser();
  const location = useLocation();

  // Show loading while authentication state is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Clear any unauthorized session data before redirecting
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Check admin requirements
  if (requireAdmin && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page. Admin privileges required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check developer requirements
  if (requireDeveloper && userRole !== 'developer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You need developer access to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prevent admins from accessing user or developer dashboards
  if (userRole === 'admin' && !requireAdmin) {
    const isDashboardPath = location.pathname.startsWith('/chat/') || 
                           location.pathname === '/projects' || 
                           location.pathname === '/tasks' ||
                           location.pathname === '/inbox';
    const isDeveloperPath = location.pathname.startsWith('/developer');
    
    if (isDashboardPath || isDeveloperPath) {
      return <Navigate to="/admin" replace />;
    }
  }

  // Prevent developers from accessing user or admin dashboards
  if (userRole === 'developer' && !requireDeveloper) {
    const isDashboardPath = location.pathname.startsWith('/chat/') ||
      location.pathname === '/projects' ||
      location.pathname === '/';
    const isAdminPath = location.pathname.startsWith('/admin');
    
    if (isDashboardPath || isAdminPath) {
      return <Navigate to="/developer" replace />;
    }
  }

  // For regular dashboard routes, allow direct session routes even without active chat
  if (!requireAdmin && !requireDeveloper) {
    const isSessionPath = location.pathname.startsWith('/chat/');
    const isProjectsOrProfilePath = location.pathname === '/projects' || location.pathname === '/profile' || location.pathname === '/tasks' || location.pathname === '/inbox' || location.pathname === '/share-chat';
    
    // Allow projects, profile, and subscription pages without chat session requirement
    if (!isSessionPath && !isProjectsOrProfilePath) {
      const hasActiveChat = userIdea || isProcessingIdea || initialResponse || sessionId;
      const hasPersistedChat = authService.getUserIdea() || authService.getSessionId();
      
      if (!hasActiveChat && !hasPersistedChat) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
