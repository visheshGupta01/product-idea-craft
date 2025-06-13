import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Sparkles, Rocket, Code, ArrowRight, Users, MessageCircle, Heart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface IdeaSubmissionScreenProps {
  onIdeaSubmit: (idea: string) => void;
}

const IdeaSubmissionScreen = ({ onIdeaSubmit }: IdeaSubmissionScreenProps) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = () => {
    if (idea.trim()) {
      onIdeaSubmit(idea);
    }
  };

  const inspirationCards = [
    { icon: Lightbulb, text: "Share your vision" },
    { icon: Code, text: "We'll build it" },
    { icon: Rocket, text: "Launch together" }
  ];

  const communityStats = [
    { icon: Users, label: "Active Builders", value: "12,847" },
    { icon: Rocket, label: "Apps Launched", value: "3,291" },
    { icon: Heart, label: "Success Stories", value: "1,564" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20 p-6">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mt-2 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img
                  src="logo.png" alt="Logo" className="w-32 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold md:h-14 h-12 mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Imagine.bo
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Turn your ideas into revenue-ready apps & websites
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by AI • No coding required
            </p>
          </div>

          {/* Inspiration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {inspirationCards.map((card, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-card-foreground">{card.text}</p>
              </div>
            ))}
          </div>

          {/* Main Input Section */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-card-foreground">What's your idea?</h2>
              <p className="text-muted-foreground">
                We'll help turn this into a real product—sit tight.
              </p>
            </div>

            <div className="space-y-6">
              <Textarea
                placeholder="Describe your app or website idea in detail... 

For example: 'A marketplace for local artists to sell their digital artwork, with features for artist profiles, secure payments, and community reviews.'"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-[120px] text-base resize-none border-2 focus:border-primary/50 rounded-xl"
              />

              <Button 
                onClick={handleSubmit}
                disabled={!idea.trim()}
                size="lg"
                className="w-full h-12 text-base font-medium rounded-xl group transition-all duration-200"
              >
                Start Building My Idea
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Your idea is secure and will only be used to help you build your product
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Join thousands of builders who have launched their ideas with Imagine.bo</p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 mb-8">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-card-foreground">Join Our Community</h2>
            <p className="text-muted-foreground">
              Connect with fellow builders, share ideas, and get feedback on your projects
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-card-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Community Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Join Discord</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Browse Community</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionScreen;
