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
        const response = await fetch(`${API_BASE_URL}/api/auth/google/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await response.json();

        // Store authentication data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userData", JSON.stringify({
          id: data.user.ID,
          first_name: data.user.FirstName,
          last_name: data.user.LastName,
          email: data.user.Email,
          user_type: data.user.UserType,
          created_at: data.user.CreatedAt,
        }));

        toast({
          title: "Success",
          description: "Successfully logged in with Google!",
        });

        // Redirect based on role
        window.location.href = data.role === "admin" ? "/admin" : "/";
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
