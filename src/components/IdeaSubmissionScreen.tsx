
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from './ThemeToggle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import IdeaSubmissionForm from './idea-submission/IdeaSubmissionForm';
import RecentProjects from './idea-submission/RecentProjects';
import CommunityProjects from './idea-submission/CommunityProjects';
import InspirationCards from './idea-submission/InspirationCards';

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
  user?: { name: string; email: string; avatar?: string };
}

const IdeaSubmissionScreen = ({ onIdeaSubmit, user }: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerAnimation = useScrollAnimation();
  const inputAnimation = useScrollAnimation();

  const handleSubmit = () => {
    if (idea.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onIdeaSubmit(idea);
      }, 800);
    }
  };

  // If user is logged in, show compact header layout with full-width projects
  if (user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/8 transition-all duration-800 ${
        isSubmitting ? 'scale-105 blur-sm' : 'scale-100 blur-none'
      }`}>
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

        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-10 animate-float">
          <ThemeToggle />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Main Content Area with Enhanced Watermark */}
          <div className="relative">
            {/* Enhanced Glowing Animated Watermark Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Primary large glowing orb behind idea submission */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse-glow animate-float"></div>
              
              {/* Secondary animated orbs */}
              <div className="absolute top-32 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/15 via-primary/8 to-transparent rounded-full blur-2xl animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-48 left-1/3 w-80 h-80 bg-gradient-to-br from-primary/12 via-primary/6 to-transparent rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
              
              {/* Additional glowing elements */}
              <div className="absolute top-64 right-1/3 w-64 h-64 bg-gradient-to-r from-primary/8 to-primary/4 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-96 left-1/4 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl animate-bounce-subtle" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Large animated logo watermarks */}
              <div className="absolute top-20 right-1/3 opacity-8 animate-float" style={{ animationDelay: '0.5s' }}>
                <img src="logo.png" alt="" className="w-48 h-48 rotate-12 filter drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(102, 232, 250, 0.3))' }} />
              </div>
              <div className="absolute top-80 left-1/4 opacity-6 animate-bounce-subtle" style={{ animationDelay: '2s' }}>
                <img src="logo.png" alt="" className="w-40 h-40 -rotate-12 filter drop-shadow-xl" style={{ filter: 'drop-shadow(0 0 15px rgba(102, 232, 250, 0.2))' }} />
              </div>
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 opacity-4 animate-pulse-glow" style={{ animationDelay: '1s' }}>
                <img src="logo.png" alt="" className="w-32 h-32 rotate-45 filter drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(102, 232, 250, 0.15))' }} />
              </div>
              
              {/* Glowing particles effect */}
              <div className="absolute top-16 left-2/3 w-4 h-4 bg-primary/30 rounded-full blur-sm animate-bounce-subtle" style={{ animationDelay: '3s' }}></div>
              <div className="absolute top-72 left-1/5 w-6 h-6 bg-primary/25 rounded-full blur animate-float" style={{ animationDelay: '2.5s' }}></div>
              <div className="absolute top-52 right-1/5 w-3 h-3 bg-primary/35 rounded-full blur-sm animate-pulse-glow" style={{ animationDelay: '1.8s' }}></div>
            </div>

            {/* Compact Header Bar for Idea Submission */}
            <div className="relative z-10 bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-4 mb-6 shadow-lg animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    What's your next big idea?
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Transform your vision into reality with AI-powered development
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Textarea
                    placeholder="Describe your app or website idea..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[50px] resize-none border-2 focus:border-primary/50 rounded-xl transition-all duration-300 text-sm"
                  />
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

            {/* Your Recent Projects */}
            <div className="relative z-10 mb-8">
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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden transition-all duration-800 ${
      isSubmitting ? 'scale-105 blur-sm' : 'scale-100 blur-none'
    }`}>
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
            headerAnimation.isVisible ? 'animate-fade-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center mt-2 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse-glow">
              <img
                src="logo.png" alt="Logo" className="w-8 mt-1 ml-1 text-primary-foreground animate-bounce-subtle" />
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
            inputAnimation.isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          } ${
            isSubmitting ? 'scale-110 shadow-2xl shadow-primary/20' : 'scale-100'
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
          <p>Join thousands of builders who have launched their ideas with Imagine.bo</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionScreen;
