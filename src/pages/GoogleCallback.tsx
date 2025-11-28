import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { storeJWTData } from "@/lib/jwtUtils";

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
          }
        });

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await response.json();

        // Parse JWT and store data from token
        const jwtResult = storeJWTData(data.token, data.refresh_token);

        if (!jwtResult) {
          throw new Error("Failed to parse authentication token");
        }

        toast({
          title: "Success",
          description: "Successfully logged in with Google!",
        });

        // Redirect based on role from JWT
        const roleRedirects: Record<string, string> = {
          admin: "/admin",
          developer: "/developer",
          user: "/",
        };
        window.location.href = roleRedirects[jwtResult.payload.user.user_type] || "/";
      } catch (error) {
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
