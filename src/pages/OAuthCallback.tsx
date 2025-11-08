import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh_token");
        const userStr = searchParams.get("user");
        const role = searchParams.get("role");
        const error = searchParams.get("error");

        if (error) {
          toast({
            title: "Authentication Failed",
            description: error,
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (!token || !refreshToken || !userStr || !role) {
          toast({
            title: "Authentication Failed",
            description: "Missing authentication data",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr));

        // Store authentication data (same format as authService)
        localStorage.setItem("authToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userData", JSON.stringify({
          id: user.ID,
          first_name: user.FirstName,
          last_name: user.LastName,
          email: user.Email,
          user_type: user.UserType,
          created_at: user.CreatedAt,
        }));

        toast({
          title: "Success",
          description: "Successfully logged in!",
        });

        // Redirect based on role - page will reload and UserProvider will pick up auth from localStorage
        window.location.href = role === "admin" ? "/admin" : "/";
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast({
          title: "Authentication Failed",
          description: "Failed to process authentication",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="lg" text="Completing authentication..." />
    </div>
  );
};

export default OAuthCallback;
