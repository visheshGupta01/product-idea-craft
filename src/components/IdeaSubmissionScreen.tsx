
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Sparkles, Rocket, Code, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
              <p className="text-sm font-medium text-foreground">{card.text}</p>
            </div>
          ))}
        </div>

        {/* Main Input Section */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">What's your idea?</h2>
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
  );
};

export default IdeaSubmissionScreen;
