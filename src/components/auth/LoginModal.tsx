import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import imagineboLogo from "@/assets/ImagineboIcon.svg";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { initiateGoogleAuth, initiateGithubAuth } from "@/services/oauthService";
import { API_BASE_URL } from "@/config/api";
import apiClient from "@/lib/apiClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");
    setShowResendButton(false);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Clear form
        setEmail("");
        setPassword("");
        
        // Wait for context state to propagate before closing modal
        setTimeout(() => {
          onClose();
          
          // Role-based redirect - only navigate if not already on the correct page
          if (result.role === 'admin') {
            navigate('/admin');
          } else if (result.role === 'developer') {
            navigate('/developer');
          }
        }, 100);
        // For regular users, no navigation needed if already on home page
      } else {
        setError(result.message || "Login failed");
        // Check if error is due to unverified email
        if (result.message?.toLowerCase().includes("verify") || result.message?.toLowerCase().includes("not verified")) {
          setShowResendButton(true);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setShowResendButton(false);
    onClose();
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsResending(true);
    try {
      await apiClient.post(`${API_BASE_URL}/api/auth/resent-verification-link`, { email });
      setError("Verification link sent! Please check your email.");
      setShowResendButton(false);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend verification link.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] w-[95vw] max-h-[90vh] overflow-y-auto custom-scroll p-4 sm:p-6 text-center bg-[#0A0A0B] border-[#1E1E1E]">
        {/* Logo */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <img src={imagineboLogo} alt="Imagine.bo" className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>

        {/* Title */}
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-white mb-2">
            Welcome back
          </DialogTitle>
        </DialogHeader>

        {/* OAuth Buttons */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <Button
            type="button"
            onClick={initiateGoogleAuth}
            disabled={isLoading}
            className="w-full h-10 bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <FaGoogle className="w-4 h-4" />
            Continue with Google
          </Button>
          <Button
            type="button"
            onClick={initiateGithubAuth}
            disabled={isLoading}
            className="w-full h-10 bg-[#24292e] text-white hover:bg-[#1a1e22] flex items-center justify-center gap-2"
          >
            <FaGithub className="w-4 h-4" />
            Continue with GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-3 sm:my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2A2A2A]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0A0A0B] px-2 text-gray-400">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Email Input */}
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="space-y-2">
              <div className={`text-sm ${error.includes("sent") ? "text-green-500" : "text-destructive"}`}>
                {error}
              </div>
              {showResendButton && (
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  variant="outline"
                  className="w-full"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Continue Button */}
          <Button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full h-10 bg-white text-black hover:bg-gray-200"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Logging in" />
            ) : (
              "Continue"
            )}
          </Button>

          {/* Forgot Password Link */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowForgotPassword(true)}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-white"
          >
            Forgot your password?
          </Button>
        </form>

        {/* Terms and Privacy */}
        <p className="text-xs text-gray-400 mt-4">
          By continuing you agree to our{" "}
          <a href="#" className="underline hover:text-white">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </p>

        {/* Switch to Signup */}
        <p className="text-sm text-gray-400 mt-3">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            disabled={isLoading}
            className="underline hover:text-white"
          >
            Sign Up
          </button>
        </p>
      </DialogContent>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </Dialog>
  );
};