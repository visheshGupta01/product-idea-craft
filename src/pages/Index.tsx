import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import IdeaSubmissionScreen from "../components/IdeaSubmissionScreen";
import FollowUpQuestions from "../components/FollowUpQuestions";
import VerificationScreen from "../components/VerificationScreen";
import MainDashboard from "../components/MainDashboard";
import Navbar from "../components/Navbar";
import LoginPage from "../components/auth/LoginPage";
import SignupPage from "../components/auth/SignupPage";
import { useUser } from "@/context/UserContext"; // ✅

type AppState =
  | "idea-submission"
  | "follow-up-questions"
  | "verification"
  | "dashboard";
type AuthModal = "login" | "signup" | null;

const Index = () => {
  const location = useLocation();
  const { user, setUser } = useUser(); // ✅ use context
  const [appState, setAppState] = useState<AppState>("idea-submission");
  const [userIdea, setUserIdea] = useState("");
  const [currentIdea, setCurrentIdea] = useState("");
  const [followUpAnswers, setFollowUpAnswers] = useState<
    Record<string, string>
  >({});
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [pendingIdea, setPendingIdea] = useState<string>("");
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAppState("idea-submission");
    setUserIdea("");
    setCurrentIdea("");
    setFollowUpAnswers({});
    setPendingIdea("");
    setIsSubmittingIdea(false);
  }, [setUser]);

  useEffect(() => {
    if (location.state?.logout) {
      handleLogout();
    }
  }, [location.state, handleLogout]);

  const handleIdeaSubmit = (idea: string) => {
    if (!user) {
      setPendingIdea(idea);
      setIsSubmittingIdea(true);
      setAuthModal("login");
      return;
    }

    setUserIdea(idea);
    setCurrentIdea("");
    setAppState("follow-up-questions");
  };

  const handleFollowUpComplete = (answers: Record<string, string>) => {
    setFollowUpAnswers(answers);
    setAppState("verification");
  };

  const handleVerificationComplete = () => {
    setAppState("dashboard");
  };

  const handleBackToIdea = () => {
    setAppState("idea-submission");
  };

  const handleBackToFollowUp = (preservedAnswers?: Record<string, string>) => {
    if (preservedAnswers) {
      setFollowUpAnswers(preservedAnswers);
    }
    setAppState("follow-up-questions");
  };

  const handleLogin = (email: string, password: string) => {
    const userData = {
      name: email.split("@")[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
    setAuthModal(null);
    setIsSubmittingIdea(false);

    if (pendingIdea) {
      setUserIdea(pendingIdea);
      setPendingIdea("");
      setCurrentIdea("");
      setAppState("follow-up-questions");
    }
  };

  const handleSignup = (email: string, password: string, name: string) => {
    const userData = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
    setAuthModal(null);
    setIsSubmittingIdea(false);

    // Move to verification step instead of follow-up
    setAppState("verification");
  };
  

  const handleAuthModalClose = () => {
    setAuthModal(null);
    setPendingIdea("");
    setIsSubmittingIdea(false);
  };

  const isFullSizePage = appState !== "idea-submission";

  return (
    <div className="min-h-screen bg-background">
      {appState === "idea-submission" && (
        <Navbar
          user={user}
          onLoginClick={() => setAuthModal("login")}
          onSignupClick={() => setAuthModal("signup")}
          onLogout={handleLogout}
        />
      )}

      <div className={isFullSizePage ? "h-screen" : ""}>
        {appState === "idea-submission" && (
          <IdeaSubmissionScreen
            onIdeaSubmit={handleIdeaSubmit}
            user={user}
            isSubmitting={isSubmittingIdea}
            idea={currentIdea}
            onIdeaChange={setCurrentIdea}
          />
        )}

        {appState === "follow-up-questions" && (
          <FollowUpQuestions
            userIdea={userIdea}
            onComplete={handleFollowUpComplete}
            onBack={handleBackToIdea}
            initialAnswers={followUpAnswers}
          />
        )}

        {appState === "verification" && (
          <VerificationScreen
            onComplete={handleVerificationComplete}
            onBack={handleBackToFollowUp}
            followUpAnswers={followUpAnswers}
          />
        )}

        {appState === "dashboard" && (
          <MainDashboard
            userIdea={userIdea}
            followUpAnswers={followUpAnswers}
          />
        )}
      </div>

      {authModal === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthModal("signup")}
          onClose={handleAuthModalClose}
        />
      )}

      {authModal === "signup" && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthModal("login")}
          onClose={handleAuthModalClose}
        />
      )}
    </div>
  );
};

export default Index;
