import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VerificationModal } from "./VerificationModal";
import imagineboLogo from "@/assets/ImagineboIcon.svg";

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
      console.log('Signup result:', result);
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
      <Dialog open={isOpen && !showVerificationModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] p-6 text-center bg-[#0A0A0B] border-[#1E1E1E]">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={imagineboLogo} alt="Imagine.bo" className="h-10 w-10" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">Create your account</h1>

        {/* Google Sign In Button */}
        {/* <Button
          variant="outline"
          className="w-full h-10 mb-3 bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
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
 */}
        {/* Divider */}
        {/* <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#2A2A2A]"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-[#2A2A2A]"></div>
        </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400"
            />

            {/* Confirm Password Input */}
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 bg-[#1A1A1A] border-[#2A2A2A] text-white placeholder:text-gray-400"
            />

            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}

            {/* Continue Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !name.trim() || !email.trim() || !password.trim() || password !== confirmPassword}
              className="w-full h-10 bg-white text-black hover:bg-gray-200"
            >
              {isLoading ? <LoadingSpinner size="sm" text="Creating account..." /> : "Continue"}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-400 mt-4">
            By continuing you agree to our{" "}
            <a href="#" className="underline hover:text-white">Terms</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">Privacy Policy</a>.
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