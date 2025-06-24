
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

  // If user is logged in, show enhanced compact layout
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

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Enhanced Input Section - Top positioned with animations */}
          <IdeaSubmissionForm
            idea={idea}
            setIdea={setIdea}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />

          {/* Enhanced Recent Projects Section */}
          <RecentProjects />

          {/* Enhanced Community Section */}
          <CommunityProjects />

          {/* Enhanced Footer */}
          <div className="text-center text-sm text-muted-foreground animate-fade-up animate-delay-500">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse animate-delay-100"></div>
                <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse animate-delay-200"></div>
              </div>
            </div>
            <p className="font-medium">Join thousands of builders who have launched their ideas successfully</p>
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
