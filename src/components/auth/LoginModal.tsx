import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import imagineboLogo from "@/assets/ImagineboIcon.svg";

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
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
       
        onClose();
        setEmail("");
        setPassword("");
        
        // Role-based redirect
        setTimeout(() => {
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setError(result.message || "Login failed");
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={imagineboLogo} alt="Imagine.bo" className="h-12 w-12" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>

        {/* Google Sign In Button */}
        <Button
          variant="outline"
          className="w-full h-12 mb-4 bg-background border-border hover:bg-muted"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-muted-foreground text-sm">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-12 bg-background border-border"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-12 bg-background border-border pr-10"
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
            <div className="text-destructive text-sm">{error}</div>
          )}

          {/* Continue Button */}
          <Button 
            type="submit" 
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? <LoadingSpinner size="sm" text="Logging in..." /> : "Continue"}
          </Button>

          {/* Forgot Password Link */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowForgotPassword(true)}
            disabled={isLoading}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot your password?
          </Button>
        </form>

        {/* Terms and Privacy */}
        <p className="text-xs text-muted-foreground mt-6">
          By continuing you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">Terms</a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>

        {/* Switch to Signup */}
        <p className="text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            disabled={isLoading}
            className="underline hover:text-foreground"
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