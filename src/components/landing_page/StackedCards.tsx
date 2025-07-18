import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import card1 from '@/assets/card-1.jpg';
import card2 from '@/assets/card-2.jpg';
import card3 from '@/assets/card-3.jpg';
import card4 from '@/assets/card-4.jpg';
import card5 from '@/assets/card-5.jpg';

interface CardData {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
}

const cardData: CardData[] = [
  {
    id: 1,
    title: "Launch Together",
    description: "Strategic product launch support",
    content: "Once in building phase, your launch marketing—whether that's preparing for Product Hunt, crafting social media content, or setting up email campaigns—to help you make a strong first impression is set up if required. When it's time to go live, we'll launch your product side by side. From deployment to early user onboarding, we handle the rollout smoothly.",
    image: card1
  },
  {
    id: 2,
    title: "Advanced Technology",
    description: "Leveraging cutting-edge tools and frameworks",
    content: "We utilize the latest technologies to build scalable, performant applications that meet modern standards and requirements. Our tech stack is carefully chosen to ensure optimal performance and maintainability.",
    image: card2
  },
  {
    id: 3,
    title: "User Experience",
    description: "Crafting meaningful digital experiences",
    content: "Every element is carefully considered to create intuitive workflows that delight users and achieve business objectives. We focus on creating seamless interactions that feel natural and engaging.",
    image: card3
  },
  {
    id: 4,
    title: "Performance Focused",
    description: "Optimized for speed and efficiency",
    content: "We prioritize performance optimization to ensure fast loading times and smooth interactions across all devices. Every component is built with performance in mind from the ground up.",
    image: card4
  },
  {
    id: 5,
    title: "Future Ready",
    description: "Built for tomorrow's challenges",
    content: "Our solutions are architected with scalability and maintainability in mind, ready to evolve with your business needs. We build with the future in mind, ensuring longevity and adaptability.",
    image: card5
  }
];

export default function StackedCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress based on section visibility
      const startOffset = rect.top;
      const endOffset = rect.bottom - windowHeight;
      
      // Progress is 0 when section just enters viewport, 1 when it's about to leave
      let progress = 0;
      if (startOffset <= 0 && endOffset >= 0) {
        // Section is in viewport
        progress = Math.abs(startOffset) / (containerHeight - windowHeight);
        progress = Math.max(0, Math.min(progress, 1));
      } else if (endOffset < 0) {
        // Section has passed
        progress = 1;
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getCardState = (index: number) => {
    const totalCards = cardData.length;
    const cardProgress = scrollProgress * (totalCards - 1);
    const currentCardIndex = Math.floor(cardProgress);
    const transitionProgress = cardProgress - currentCardIndex;
    
    if (index < currentCardIndex) {
      return 'previous';
    } else if (index === currentCardIndex) {
      return transitionProgress > 0.5 ? 'exiting' : 'current';
    } else if (index === currentCardIndex + 1) {
      return transitionProgress > 0.5 ? 'entering' : 'next';
    } else {
      return 'future';
    }
  };

  const getCardAnimation = (index: number) => {
    const state = getCardState(index);
    const totalCards = cardData.length;
    const cardProgress = scrollProgress * (totalCards - 1);
    const currentCardIndex = Math.floor(cardProgress);
    const transitionProgress = cardProgress - currentCardIndex;
    
    switch (state) {
      case 'previous':
        { const stackLevel = currentCardIndex - index;
        return {
          y: -15 - (stackLevel - 1) * 6 - 100,
          scale: 0.7 - (stackLevel - 1) * 0.02,
          filter: `blur(${0.5 + (stackLevel - 1) * 0.3}px)`,
          opacity: Math.max(0.7, 0.9 - (stackLevel - 1) * 0.08),
          zIndex: totalCards - stackLevel - 1,
        }; }
      
      case 'current':
        return {
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: totalCards,
        };
      
      case 'exiting':
        return {
          y: -transitionProgress * 30 - 60,
          scale: 1 - transitionProgress * 0.1,
          filter: `blur(${transitionProgress * 1}px)`,
          opacity: 1 - transitionProgress * 0.3,
          zIndex: totalCards - 1,
        };
      
      case 'entering':
        return {
          y: (1 - transitionProgress) * 100,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: totalCards,
        };
      
      case 'next':
        return {
          y: 500,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: totalCards,
        };
      
      case 'future':
        { const futureLevel = index - currentCardIndex - 1;
        return {
          y: 500 + futureLevel * 120,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: totalCards,
        }; }
      
      default:
        return {
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 1,
        };
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-bg relative"
      style={{ height: `${cardData.length * 100}vh` }}
    >

      

      {/* Sticky Cards Container */}
      <div className="sticky top-16 h-screen flex items-center justify-center  bg-gradient-bg">
        {cardData.map((card, index) => {
          const animation = getCardAnimation(index);
          return (
            <motion.div
              key={card.id}
              className="bg-[#B1C5CE] absolute w-full max-w-4xl border-0 shadow-xl backdrop-blur-sm overflow-hidden rounded-3xl"
              animate={{
                y: animation.y,
                scale: animation.scale,
                filter: animation.filter,
                opacity: animation.opacity,
              }}
              style={{
                zIndex: animation.zIndex,
                background: "#B1C5CE",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
              }}
            >
              <div
                className={`flex h-[420px] ${
                  index % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              >
                {/* Visual Section */}
                <div
                  className={`w-1/2 relative bg-[#D9D9D9] ${
                    index % 2 === 0 ? "rounded-l-3xl" : "rounded-r-3xl"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-200/90 to-stone-300/70 ${
                      index % 2 === 0 ? "rounded-l-3xl" : "rounded-r-3xl"
                    }`}
                  />
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="w-40 h-40 bg-stone-300/40 rounded-2xl border border-stone-400/30" />
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className={`w-1/2 p-10 flex flex-col justify-start space-y-8  ${
                    index % 2 === 0 ? "rounded-r-3xl" : "rounded-l-3xl"
                  }`}
                >
                  <div className="pt-6">
                    <h2 className="text-[28px] font-poppins font-semibold text-foreground mb-4 leading-tight">
                      {card.title}
                    </h2>
                  </div>

                  <p className="text-foreground/70 font-medium text-[18px] font-poppins leading-relaxed text-base">
                    {card.content}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}