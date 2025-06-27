
import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "./ThemeToggle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import IdeaSubmissionForm from "./idea-submission/IdeaSubmissionForm";
import RecentProjects from "./idea-submission/RecentProjects";
import CommunityProjects from "./idea-submission/CommunityProjects";
import InspirationCards from "./idea-submission/InspirationCards";
import TextToSpeechPanelComponent, {
  TextToSpeechPanelRef,
} from "@/components/ui/speech-to-text"; // adjust path if needed
import { Sparkles, Zap } from "lucide-react";

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
  user?: { name: string; email: string; avatar?: string };
  isSubmitting?: boolean;
}

const IdeaSubmissionScreen = ({
  onIdeaSubmit,
  user,
  isSubmitting: externalIsSubmitting = false,
}: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState("");
  const speechRef = useRef<TextToSpeechPanelRef>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [userTyped, setUserTyped] = useState(false);

  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  
  // Use external isSubmitting prop if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const headerAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();

  const handleSpeechTranscript = (transcript: string) => {
    setIdea((prev) => prev + (prev ? " " : "") + transcript);
    setLiveTranscript("");
    setUserTyped(false); // allow live speech to continue updating after final
  };

  const handleSubmit = () => {
    if (idea.trim()) {
      if (!user) {
        // For non-logged-in users, don't set internal submitting state
        // as it will be handled by the parent component
        onIdeaSubmit(idea);
      } else {
        // For logged-in users, set internal submitting state
        setInternalIsSubmitting(true);
        setTimeout(() => {
          onIdeaSubmit(idea);
        }, 800);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey && !isSubmitting && idea.trim()) {
      e.preventDefault();
      handleSubmit();
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
        <div className="fixed top-6 right-6 z-20 animate-float">
          <ThemeToggle />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
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
                  className="w-96 h-96 filter grayscale"
                />
              </div>
            </div>

            {/* Centered Welcome Message */}
            <div className="relative z-10 mb-8 animate-fade-up text-center">
              <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-lg">
                    <Zap className="w-6 h-6 text-primary animate-bounce-subtle" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      Welcome back, {user.name}!
                    </h2>
                    <p className="text-base text-muted-foreground mt-1">
                      Ready to build something amazing today?
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Idea Submission Box */}
            <div className="relative z-10 max-w-4xl mx-auto bg-gradient-to-br from-card/95 via-card/90 to-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-8 mb-8 shadow-2xl shadow-primary/10 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-700 hover:scale-[1.01] animate-fade-up animate-delay-200">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: "1s" }}></div>

              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/25 rounded-2xl flex items-center justify-center animate-bounce-subtle shadow-lg">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                        What's your next big idea?
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        Transform your vision into reality with AI-powered development
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-end">
                  <div className="flex-1">
                    <div className="space-y-6">
                      <div className="relative group">
                        <Textarea
                          placeholder="Describe your app or website idea in detail... (Press Shift+Enter to submit)"
                          value={
                            userTyped
                              ? idea
                              : idea +
                                (liveTranscript ? " " + liveTranscript : "")
                          }
                          onChange={(e) => {
                            setUserTyped(true); // user typed manually, stop auto appending
                            setIdea(e.target.value);
                          }}
                          onKeyDown={handleKeyDown}
                          disabled={isSubmitting}
                          className="min-h-[100px] resize-none border-2 focus:border-primary/50 rounded-2xl transition-all duration-300 text-base group-hover:shadow-lg group-hover:shadow-primary/10 bg-background/80 backdrop-blur-sm px-6 py-4"
                        />
                        <div className="absolute top-4 right-4">
                          <TextToSpeechPanelComponent
                            ref={speechRef}
                            onTranscript={handleSpeechTranscript}
                            onInterimTranscript={setLiveTranscript}
                            disabled={isSubmitting}
                            className="h-10 w-10 hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!idea.trim() || isSubmitting}
                    className="px-10 py-4 h-[100px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse"></div>
                    {isSubmitting ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mb-2"></div>
                        <span className="text-sm">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Sparkles className="w-6 h-6 mb-2 group-hover:animate-bounce" />
                        <span>Start Building</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Enhanced Progress indicator */}
                <div className="mt-6 flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Secure & encrypted</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    <span>AI-powered development</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Recent Projects with enhanced styling */}
            <div className="relative z-10 mb-10 backdrop-blur-[1px] animate-fade-up animate-delay-400">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold text-center">Your Recent Projects</h2>
                <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                </div>
              </div>
              <RecentProjects />
            </div>
          </div>

          {/* Full-width Community Section */}
          <div className="animate-fade-up animate-delay-500">
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
      <div className="fixed top-6 right-6 z-10 animate-float">
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
