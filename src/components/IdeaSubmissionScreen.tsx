
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
import { Sparkles, Zap, Star, Rocket } from "lucide-react";

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
  user?: { name: string; email: string; avatar?: string };
  isSubmitting?: boolean;
  idea: string;
  onIdeaChange: (idea: string) => void;
}

const IdeaSubmissionScreen = ({
  onIdeaSubmit,
  user,
  isSubmitting: externalIsSubmitting = false,
  idea,
  onIdeaChange,
}: IdeaSubmissionScreenProps) => {
  const speechRef = useRef<TextToSpeechPanelRef>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [userTyped, setUserTyped] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedLine, setDisplayedLine] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  
  // Use external isSubmitting prop if provided, otherwise use internal state
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const headerAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();

  const rotatingLines = [
    "Ready to build something amazing?",
    "Let's turn your vision into reality",
    "What innovative idea will you create today?",
    "Transform your thoughts into digital magic"
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Name typewriter effect
  useEffect(() => {
    if (!user) return;
    
    const capitalizedName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    let index = 0;
    
    const nameInterval = setInterval(() => {
      if (index < capitalizedName.length) {
        setDisplayedName(capitalizedName.slice(0, index + 1));
        index++;
      } else {
        clearInterval(nameInterval);
      }
    }, 100);

    return () => clearInterval(nameInterval);
  }, [user]);

  // Rotating line typewriter effect
  useEffect(() => {
    if (!user) return;

    const typewriteLine = () => {
      const currentLine = rotatingLines[currentLineIndex];
      let charIndex = 0;
      
      setDisplayedLine("");
      
      const lineInterval = setInterval(() => {
        if (charIndex < currentLine.length) {
          setDisplayedLine(currentLine.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(lineInterval);
          setTimeout(() => {
            setCurrentLineIndex((prev) => (prev + 1) % rotatingLines.length);
          }, 2000);
        }
      }, 50);

      return () => clearInterval(lineInterval);
    };

    const timeout = setTimeout(typewriteLine, 500);
    return () => clearTimeout(timeout);
  }, [currentLineIndex, user]);

  const handleSpeechTranscript = (transcript: string) => {
    const newIdea = idea + (idea ? " " : "") + transcript;
    onIdeaChange(newIdea);
    setLiveTranscript("");
    setUserTyped(false);
  };

  const handleSubmit = () => {
    if (idea.trim()) {
      if (!user) {
        onIdeaSubmit(idea);
      } else {
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
        className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 relative overflow-hidden transition-all duration-1000 ease-out ${
          isSubmitting ? "scale-105 blur-sm" : "scale-100 blur-none"
        }`}
      >
        {/* Interactive background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              transform: `translate(${Math.sin(Date.now() / 3000) * 20}px, ${Math.cos(Date.now() / 4000) * 15}px)`
            }}
          />
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-40 w-1 h-1 bg-primary/35 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Animated textbox overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
            <div className="animate-scale-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl animate-pulse" />
                <Textarea
                  value={idea}
                  readOnly
                  className="relative w-96 h-32 text-base border-2 border-primary/30 rounded-xl shadow-2xl shadow-primary/25 bg-card/95 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Theme Toggle Button - floating with higher z-index */}
        <div className="fixed top-6 right-6 z-20">
          <div className="animate-float hover:scale-110 transition-transform duration-300">
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Static Welcome with Typewriter Name and Rotating Line */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-up">
            <div className="relative">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent relative">
                  {displayedName}
                  <span className="animate-pulse text-primary">|</span>
                </span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground min-h-[24px] transition-all duration-300">
                {displayedLine}
                <span className="animate-pulse text-primary">|</span>
              </p>
            </div>
          </div>

          {/* Enhanced Idea Submission Box */}
          <div className="relative z-10 max-w-4xl mx-auto mb-8 sm:mb-12 animate-fade-up animate-delay-200">
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-pulse" />
              
              <div className="relative bg-gradient-to-br from-card/98 via-card/95 to-card/90 backdrop-blur-xl border border-border/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/5 hover:shadow-3xl hover:shadow-primary/15 transition-all duration-700 hover:scale-[1.02] hover:border-primary/20">
                {/* Floating decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-to-br from-primary/3 via-transparent to-primary/3 pointer-events-none" />
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-2xl animate-pulse opacity-60" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-xl animate-pulse opacity-40" style={{ animationDelay: '1s' }} />

                <div className="relative">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 hover:scale-110">
                          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-bounce-subtle" />
                        </div>
                       
                      </div>
                      <div className="text-center">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                          What's your next big idea?
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Transform your vision into reality with AI
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <div className="relative group/input">
                        <Textarea
                          placeholder="Describe your app or website idea... (Press Shift+Enter to submit)"
                          value={
                            userTyped
                              ? idea
                              : idea + (liveTranscript ? " " + liveTranscript : "")
                          }
                          onChange={(e) => {
                            setUserTyped(true);
                            onIdeaChange(e.target.value);
                          }}
                          onKeyDown={handleKeyDown}
                          disabled={isSubmitting}
                          className="min-h-[80px] sm:min-h-[100px] resize-none border-2 focus:border-primary/50 rounded-2xl transition-all duration-500 text-sm sm:text-base group-hover/input:shadow-lg group-hover/input:shadow-primary/10 bg-background/90 backdrop-blur-sm px-4 py-3 hover:bg-background/95 focus:bg-background/100"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="hover:scale-110 transition-transform duration-300">
                            <TextToSpeechPanelComponent
                              ref={speechRef}
                              onTranscript={handleSpeechTranscript}
                              onInterimTranscript={setLiveTranscript}
                              disabled={isSubmitting}
                              className="h-8 w-8 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={!idea.trim() || isSubmitting}
                      className="w-full lg:w-auto px-6 py-3 h-[80px] sm:h-[100px] bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base group/button relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover/button:animate-pulse" />
                      {isSubmitting ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mb-2"></div>
                          <span className="text-xs sm:text-sm">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Rocket className="w-5 h-5 sm:w-6 sm:h-6 mb-2 group-hover/button:animate-bounce transition-transform duration-300" />
                          <span className="whitespace-nowrap">Start Building</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Enhanced Progress indicator */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: "0.5s" }}></div>
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: "1s" }}></div>
                      <span>Lightning Fast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Recent Projects */}
          <div className="relative z-10 mb-8 sm:mb-12 animate-fade-up animate-delay-400">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/25 to-primary/15 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Your Recent Projects
                </h2>
                <div className="w-8 h-8 bg-gradient-to-br from-primary/25 to-primary/15 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 text-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
                </div>
              </div>
            </div>
            <div className="hover:scale-[1.01] transition-transform duration-500">
              <RecentProjects />
            </div>
          </div>
        </div>

        {/* Enhanced Community Section */}
        <div className="animate-fade-up animate-delay-500 hover:scale-[1.005] transition-transform duration-700">
          <CommunityProjects />
        </div>
      </div>
    );
  }

  // Enhanced layout for non-logged-in users
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/8 overflow-x-hidden relative transition-all duration-1000 ease-out ${
        isSubmitting ? "scale-105 blur-sm" : "scale-100 blur-none"
      }`}
    >
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-primary/3 rounded-full blur-3xl transition-all duration-1000 ease-out opacity-70"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `translate(${Math.sin(Date.now() / 3000) * 30}px, ${
              Math.cos(Date.now() / 4000) * 20
            }px)`,
          }}
        />
      </div>

      {/* Animated textbox overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl animate-pulse" />
              <Textarea
                value={idea}
                readOnly
                className="relative w-80 sm:w-96 h-32 text-base border-2 border-primary/30 rounded-xl shadow-2xl shadow-primary/25 bg-card/95 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-10">
        <div className="animate-float hover:scale-110 transition-transform duration-300">
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            headerAnimation.isVisible
              ? "animate-fade-up"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center mt-2 mb-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 shadow-2xl hover:shadow-3xl hover:shadow-primary/20 transition-all duration-500 hover:scale-110">
                <img
                  src="logo.png"
                  alt="Logo"
                  className="w-10 sm:w-12 mt-1 ml-1 animate-bounce-subtle"
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent animate-gradient hover:scale-105 transition-transform duration-500 cursor-default sm:leading-[1.1] md:leading-[1.1] lg:leading-[1.1]">
            Imagine.bo
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-3 hover:text-foreground transition-colors duration-500">
            Turn your ideas into revenue-ready apps & websites
          </p>
          <p className="text-sm sm:text-base text-muted-foreground hover:text-foreground/80 transition-colors duration-300">
            Powered by AI & SDE • No coding required
          </p>
        </div>

        {/* Enhanced Inspiration Cards */}
        <div className="hover:scale-[1.01] transition-transform duration-500">
          <InspirationCards />
        </div>

        {/* Enhanced Main Input Section */}
        <div
          ref={inputAnimation.ref}
          className={`relative mb-16 sm:mb-20 transition-all duration-800 ${
            inputAnimation.isVisible ? "animate-scale-in" : "opacity-0 scale-95"
          } ${
            isSubmitting
              ? "scale-110 shadow-2xl shadow-primary/20"
              : "scale-100"
          }`}
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-2xl opacity-0 hover:opacity-100 transition-all duration-1000" />
          <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary/10 hover:shadow-3xl hover:shadow-primary/20 transition-all duration-700 hover:scale-[1.02]">
            <IdeaSubmissionForm
              idea={idea}
              setIdea={onIdeaChange}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Enhanced Community Section */}
        <div className="hover:scale-[1.005] transition-transform duration-700">
          <CommunityProjects />
        </div>

        {/* Enhanced Footer */}
        <div className="text-center text-sm sm:text-base text-muted-foreground animate-fade-up animate-delay-500 mt-16 hover:text-foreground transition-colors duration-500">
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
