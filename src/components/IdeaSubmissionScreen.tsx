
import React, { useRef, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import IdeaSubmissionForm from "./idea-submission/IdeaSubmissionForm";
import RecentProjects from "./idea-submission/RecentProjects";
import CommunityProjects from "./idea-submission/CommunityProjects";
import InspirationCards from "./idea-submission/InspirationCards";
import TextToSpeechPanelComponent, {
  TextToSpeechPanelRef,
} from "@/components/ui/speech-to-text";

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
  user?: { name: string; email: string; avatar?: string };
  authModal?: 'login' | 'signup' | null;
}

const IdeaSubmissionScreen = ({
  onIdeaSubmit,
  user,
  authModal,
}: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState("");
  const speechRef = useRef<TextToSpeechPanelRef>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [userTyped, setUserTyped] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();

  // Reset isSubmitting when auth modal is closed without completing login
  useEffect(() => {
    if (!authModal && isSubmitting && !user) {
      setIsSubmitting(false);
    }
  }, [authModal, isSubmitting, user]);

  const handleSpeechTranscript = (transcript: string) => {
    setIdea((prev) => prev + (prev ? " " : "") + transcript);
    setLiveTranscript("");
    setUserTyped(false);
  };

  const handleSubmit = () => {
    if (idea.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onIdeaSubmit(idea);
        // Reset isSubmitting after successful submission
        if (user) {
          setIsSubmitting(false);
        }
      }, 800);
    }
  };

  // If user is logged in, show compact header layout with full-width projects
  if (user) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/8 transition-all duration-800 ${
          isSubmitting ? "scale-105 blur-sm" : "scale-100 blur-none"
        }`}
      >
        {/* Animated textbox overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm">
            <div className="animate-scale-in">
              <Textarea
                value={idea}
                readOnly
                className="w-96 h-32 text-base border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 bg-card"
              />
            </div>
          </div>
        )}

        {/* Theme Toggle Button - floating with higher z-index */}
        <div className="fixed top-6 right-6 z-50 animate-float">
          <ThemeToggle />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Main Content Area with Subtle Watermark */}
          <div className="relative">
            {/* Subtle Watermark Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Single subtle logo watermark */}
              <div
                className="absolute top-40 left-1/2 transform -translate-x-1/2 opacity-[0.03] pointer-events-none"
                style={{ animationDelay: "1s" }}
              >
                <img
                  src="logo.png"
                  alt=""
                  className="w-96 h-96 filter grayscale blur-sm"
                />
              </div>
            </div>

            {/* Compact Header Bar for Idea Submission */}
            <div className="relative z-10 bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-4 mb-6 shadow-lg animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    What's your next big idea?
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Transform your vision into reality with AI-powered
                    development
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <div className="space-y-6">
                    <div className="relative">
                      <Textarea
                        placeholder="Describe your app or website idea in detail..."
                        value={
                          userTyped
                            ? idea
                            : idea +
                              (liveTranscript ? " " + liveTranscript : "")
                        }
                        onChange={(e) => {
                          setUserTyped(true);
                          setIdea(e.target.value);
                        }}
                        disabled={isSubmitting}
                        className="min-h-[50px] resize-none border-2 focus:border-primary/50 rounded-xl transition-all duration-300 text-sm"
                      />
                      <div className="absolute top-3 right-3">
                        <TextToSpeechPanelComponent
                          ref={speechRef}
                          onTranscript={handleSpeechTranscript}
                          onInterimTranscript={setLiveTranscript}
                          disabled={isSubmitting}
                          className="h-8 w-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!idea.trim() || isSubmitting}
                  className="px-6 py-2 h-[50px] bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground mr-2"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Start Building</span>
                  )}
                </button>
              </div>
            </div>

            {/* Your Recent Projects with subtle blur backdrop */}
            <div className="relative z-10 mb-8 backdrop-blur-[1px]">
              <h2 className="text-xl font-bold mb-4">Your Recent Projects</h2>
              <RecentProjects />
            </div>
          </div>

          {/* Full-width Community Section */}
          <div className="animate-fade-up animate-delay-300">
            <CommunityProjects />
          </div>
        </div>
      </div>
    );
  }

  // Original layout for non-logged-in users
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden transition-all duration-800 ${
        isSubmitting ? "scale-105 blur-sm" : "scale-100 blur-none"
      }`}
    >
      {/* Animated textbox overlay - appears during transition */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm">
          <div className="animate-scale-in">
            <Textarea
              value={idea}
              readOnly
              className="w-96 h-32 text-base border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 bg-card"
            />
          </div>
        </div>
      )}

      {/* Theme Toggle Button - with float animation */}
      <div className="fixed top-6 right-6 z-50 animate-float">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header - with fade up animation */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 transition-all duration-800 ${
            headerAnimation.isVisible
              ? "animate-fade-up"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center mt-2 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse-glow">
              <img
                src="logo.png"
                alt="Logo"
                className="w-8 mt-1 ml-1 text-primary-foreground animate-bounce-subtle"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold md:h-14 h-12 mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
            Imagine.bo
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Turn your ideas into revenue-ready apps & websites
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by AI & SDE • No coding required
          </p>
        </div>

        {/* Inspiration Cards - with staggered slide animations */}
        <InspirationCards />

        {/* Main Input Section - with scale animation and submission state */}
        <div
          ref={inputAnimation.ref}
          className={`bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/5 mb-16 transition-all duration-600 ${
            inputAnimation.isVisible ? "animate-scale-in" : "opacity-0 scale-95"
          } ${
            isSubmitting
              ? "scale-110 shadow-2xl shadow-primary/20"
              : "scale-100"
          }`}
        >
          <IdeaSubmissionForm
            idea={idea}
            setIdea={setIdea}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Community Section - with slide animations */}
        <CommunityProjects />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-fade-up animate-delay-500">
          <p>
            Join thousands of builders who have launched their ideas with
            Imagine.bo
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionScreen;
