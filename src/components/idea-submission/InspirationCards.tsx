
import React from 'react';
import { Lightbulb, Code, Rocket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const InspirationCards = () => {
  const cardsAnimation = useScrollAnimation();

  const inspirationCards = [
    { icon: Lightbulb, text: "Share your vision" },
    { icon: Code, text: "We'll build it" },
    { icon: Rocket, text: "Launch together" }
  ];

  return (
    <div 
      ref={cardsAnimation.ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
    >
      {inspirationCards.map((card, index) => (
        <div 
          key={index}
          className={`bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
            cardsAnimation.isVisible 
              ? `animate-slide-in-left animate-delay-${(index + 1) * 100}`
              : 'opacity-0 -translate-x-8'
          }`}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <card.icon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-card-foreground">{card.text}</p>
        </div>
      ))}
    </div>
  );
};

export default InspirationCards;
