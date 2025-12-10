import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface SessionValidatorProps {
  sessionId: string;
  onValidationComplete: (isValid: boolean) => void;
  children?: React.ReactNode;
  pageNumber?:number;
}

export const SessionValidator: React.FC<SessionValidatorProps> = ({
  sessionId,
  onValidationComplete,
  children,
  pageNumber
}) => {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateSession = async () => {
      if (!authService.isAuthenticated()) {
        onValidationComplete(false);
        navigate("/");
        return;
      }

      try {
        // Check if user owns this session
        const userProjects = await fetchProjects(pageNumber);
        const ownsSession = userProjects.some(
          (project) => project.session_id === sessionId
        );

        if (ownsSession) {
          onValidationComplete(true);
        } else {
          // Clear any unauthorized session data
          sessionStorage.removeItem(`chat_session_${sessionId}`);
          sessionStorage.removeItem("session_id");

          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have access to this project session.",
          });

          onValidationComplete(false);
          navigate("/projects");
        }
      } catch (error) {
        //console.error('Session validation error:', error);

        // Clear potentially compromised session data
        sessionStorage.removeItem(`chat_session_${sessionId}`);
        sessionStorage.removeItem("session_id");

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to validate session access.",
        });

        onValidationComplete(false);
        navigate("/projects");
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [sessionId, onValidationComplete, navigate, toast]);

  if (isValidating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating session access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
