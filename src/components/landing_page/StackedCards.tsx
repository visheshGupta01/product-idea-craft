import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import card1 from "@/assets/card-1.avif";
import card2 from "@/assets/card-2.avif";
import card3 from "@/assets/card-3.avif";

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
    title: "Start with Your Vision",
    description: "Strategic product launch support",
    content:
      "Tell us what you’re dreaming of—your product idea, the problem it solves, and the audience it serves. We’ll work with you to refine your concept and align on the goals, features, and direction before anything gets built with the power of AI.",
    image: card2,
  },
  {
    id: 2,
    title: "Plans with Purpose",
    description: "Leveraging cutting-edge tools and frameworks",
    content:
      "Imagine.bo doesn’t just generate—it thinks. Every response is backed by deep AI analysis and pattern recognition to shape your layout, structure, and content with clarity. The result: a website that makes sense for your audience and your goals.",
    image: card3,
  },
  {
    id: 3,
    title: "Support That Stays With You",
    description: "Crafting meaningful digital experiences",
    content:
      "As your project takes shape, our team supports you through critical development phases. Helps with custom code integration, backend logic, deployment pipelines, and even scaling strategies. And after you go live, we’re still here for updates, debugging, and improvements.",
    image: card1,
  },
];

export default function StackedCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const update = () => {
        const container = containerRef.current!;
        const rect = container.getBoundingClientRect();
        const containerHeight = container.offsetHeight;
        const windowHeight = window.innerHeight;

        const startOffset = rect.top;
        const endOffset = rect.bottom - windowHeight;

        let progress = 0;
        if (startOffset <= 0 && endOffset >= 0) {
          progress = Math.abs(startOffset) / (containerHeight - windowHeight);
          progress = Math.max(0, Math.min(progress, 1));
        } else if (endOffset < 0) {
          progress = 1;
        }

        setScrollProgress(progress);
        ticking = false;
      };

      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-gradient-bg relative"
      style={{ height: `${cardData.length * 100}vh` }}
    >
      <div className="sticky top-16 h-screen flex items-center justify-center bg-gradient-bg">
        {cardData.map((card, index) => (
          <AnimatedCard
            key={card.id}
            card={card}
            index={index}
            scrollProgress={scrollProgress}
            totalCards={cardData.length}
          />
        ))}
      </div>
    </div>
  );
}

const AnimatedCard = memo(function AnimatedCard({
  card,
  index,
  scrollProgress,
  totalCards,
}: {
  card: CardData;
  index: number;
  scrollProgress: number;
  totalCards: number;
}) {
  const cardProgress = scrollProgress * (totalCards - 1);
  const currentCardIndex = Math.floor(cardProgress);
  const transitionProgress = cardProgress - currentCardIndex;

  const getCardState = () => {
    if (index < currentCardIndex) return "previous";
    if (index === currentCardIndex)
      return transitionProgress > 0.5 ? "previous" : "current";
    if (index === currentCardIndex + 1)
      return transitionProgress > 0.5 ? "current" : "next";
    return "future";
  };

  const state = getCardState();

  const animation =
    state === "previous"
      ? {
          y: -15 - (currentCardIndex - index - 1) * 6 - 100,
          scale: 0.7 - (currentCardIndex - index - 1) * 0.02,
          filter: `blur(${Math.min(
            0.5 + (currentCardIndex - index - 1) * 0.3,
            2
          )}px)`,
          opacity: Math.max(
            1,
            0.9 - (currentCardIndex - index - 1) * 0.08 - 200
          ),
          zIndex: totalCards - (currentCardIndex - index) - 1,
        }
      : state === "current"
      ? {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: totalCards,
        }
      : state === "next"
      ? {
          y: 500,
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: totalCards,
        }
      : {
          y: 500 + (index - currentCardIndex - 1) * 120,
          scale: 1,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: totalCards,
        };

  return (
    <motion.div
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
        willChange: "transform, filter, opacity",
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
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div
          className={`w-1/2 p-10 flex flex-col justify-start space-y-8 ${
            index % 2 === 0 ? "rounded-r-3xl" : "rounded-l-3xl"
          }`}
        >
          <div className="pt-6">
            <h2 className="text-[28px] font-poppins font-semibold text-[#000000] mb-4 leading-tight">
              {card.title}
            </h2>
          </div>

          <p className="text-[#000000] font-medium text-[18px] font-poppins leading-relaxed text-base">
            {card.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
});
