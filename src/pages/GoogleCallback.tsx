import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
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

        if (!code) {
          toast({
            title: "Authentication Failed",
            description: "Missing authorization code",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Call backend to exchange code for tokens
        const response = await fetch(`${API_BASE_URL}/api/auth/google/callback?code=${code}&state=${state}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }        });

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await response.json();

        // Store authentication data
localStorage.setItem("auth_token", data.token);
localStorage.setItem("refresh_token", data.refresh_token);
localStorage.setItem("user_role", data.role);
localStorage.setItem("user_data", JSON.stringify(data.user));

        toast({
          title: "Success",
          description: "Successfully logged in with Google!",
        });

        // Redirect based on role
const roleRedirects = {
  admin: "/admin",
  developer: "/developer",
  user: "/", // default role
};
window.location.href = roleRedirects[data.role] || "/";      } catch (error) {
        console.error("Google OAuth callback error:", error);
        toast({
          title: "Authentication Failed",
          description: "Failed to process Google authentication",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="lg" text="Completing Google authentication..." />
    </div>
  );
};

export default GoogleCallback;
