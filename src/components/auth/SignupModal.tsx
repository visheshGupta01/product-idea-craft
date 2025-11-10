import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VerificationModal } from "./VerificationModal";
import { Eye, EyeOff } from "lucide-react";
import imagineboLogo from "@/assets/ImagineboIcon.svg";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { initiateGoogleAuth, initiateGithubAuth } from "@/services/oauthService";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { signup } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signup(name, email, password);
      //console.log('Signup result:', result);
      if (result.success) {
        // Show verification modal instead of closing immediately
        setShowVerificationModal(true);
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowVerificationModal(false);
    onClose();
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
    handleClose(); // Close the signup modal too
  };

  return (
    <>
      <Dialog
        open={isOpen && !showVerificationModal}
        onOpenChange={handleClose}
      >
        <DialogContent className="sm:max-w-[400px] w-[95vw] max-h-[90vh] overflow-y-auto custom-scroll p-4 sm:p-6 text-center bg-[#0A0A0B] border-[#1E1E1E]">
          {/* Logo */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <img src={imagineboLogo} alt="Imagine.bo" className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Create your account
          </h1>

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
            {/* Name Input */}
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400"
            />

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
                placeholder="Enter your password"
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
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>

            {error && <div className="text-destructive text-sm">{error}</div>}

            {/* Continue Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !name.trim() ||
                !email.trim() ||
                !password.trim() ||
                password !== confirmPassword
              }
              className="w-full h-10 bg-white text-black hover:bg-gray-200"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="Creating account..." />
              ) : (
                "Continue"
              )}
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

          {/* Switch to Login */}
          <p className="text-sm text-gray-400 mt-3">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="underline hover:text-white"
            >
              Log In
            </button>
          </p>
        </DialogContent>
      </Dialog>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={handleVerificationClose}
        email={email}
      />
    </>
  );
};
