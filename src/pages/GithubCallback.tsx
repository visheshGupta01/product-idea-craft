import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { storeJWTData } from "@/lib/jwtUtils";

const GithubCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
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

      if (!code || !state) {
        toast({
          title: "Authentication Failed",
          description: "Missing authorization code or state",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        // CASE 1: Normal GitHub login
        if (state === "github-auth") {
          const response = await fetch(
            `${API_BASE_URL}/api/github/callback?code=${code}&state=${state}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to authenticate with GitHub");
          }

          const data = await response.json();

          // Parse JWT and store data from token
          const jwtResult = storeJWTData(data.token, data.refresh_token);

          if (!jwtResult) {
            throw new Error("Failed to parse authentication token");
          }

          toast({
            title: "Success",
            description: "Successfully logged in with GitHub!",
          });

          // Redirect based on role from JWT
          const roleRedirects: Record<string, string> = {
            admin: "/admin",
            developer: "/developer",
            user: "/",
          };
window.location.href = roleRedirects[jwtResult.payload.user.user_type] || "/";        }

        // CASE 2: Repository Authorization flow (sessionId or org)
        else {
          // Let backend handle HTML redirect and org selection
          const redirectUrl = `${API_BASE_URL}/api/github/callback?code=${code}&state=${state}`;
          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error("GitHub OAuth callback error:", error);
        toast({
          title: "Authentication Failed",
          description: "Failed to process GitHub authentication",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner size="lg" text="Completing GitHub authentication..." />
    </div>
  );
};

export default GithubCallback;
