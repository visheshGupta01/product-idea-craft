import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import card1 from "@/assets/card-1.avif";
import card2 from "@/assets/card-2.avif";
import card3 from "@/assets/card-3.avif";

const cardData = [
  {
    id: 1,
    title: "Start with Your Vision",
    content:
      "Tell us what you’re dreaming of—your product idea, the problem it solves, and the audience it serves. We’ll work with you to refine your concept and align on the goals, features, and direction before anything gets built with the power of AI.",
    image: card2,
  },
  {
    id: 2,
    title: "Plans with Purpose",
    content:
      "Imagine.bo doesn’t just generate—it thinks. Every response is backed by deep AI analysis and pattern recognition to shape your layout, structure, and content with clarity. The result: a website that makes sense for your audience and your goals.",
    image: card3,
  },
  {
    id: 3,
    title: "Support That Stays With You",
    content:
      "As your project takes shape, our team supports you through critical development phases. Helps with custom code integration, backend logic, deployment pipelines, and even scaling strategies. And after you go live, we’re still here for updates, debugging, and improvements.",
    image: card1,
  },
];

export default function StackedCards() {
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={wrapperRef} className="relative h-[300vh] bg-gradient-bg">
      <div className="sticky top-8 h-screen flex items-center justify-center px-4 md:px-6 lg:px-8">
        {[...cardData].reverse().map((card, i) => {
          const realIndex = cardData.length - 1 - i;

          return (
            <SmoothCard
              key={card.id}
              card={card}
              index={realIndex}
              totalCards={cardData.length}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </div>
    </div>
  );
}

function SmoothCard({ card, index, totalCards, scrollYProgress }: any) {
  const start = index * 0.33;
  const end = start + 0.33;

  const y = useTransform(scrollYProgress, [start, end], [300, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: index,
      }}
      className="
        absolute 
        w-full 
        max-w-[90vw] sm:max-w-[85vw] md:max-w-3xl lg:max-w-4xl
        shadow-xl 
        rounded-2xl md:rounded-3xl
        overflow-hidden 
        bg-[#B1C5CE]
        border border-white/10
      "
    >
      <div className={`flex flex-col md:flex-row min-h-[350px] md:h-[380px] lg:h-[450px] ${index % 2 ? "md:flex-row-reverse" : ""}`}>
        {/* Image */}
        <div className="w-full md:w-1/2 h-[200px] md:h-auto relative">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-semibold mb-3 md:mb-4 text-black font-poppins">{card.title}</h2>
          <p className="text-sm sm:text-base md:text-[16px] lg:text-[17px] leading-relaxed text-black font-poppins">{card.content}</p>
        </div>
      </div>
    </motion.div>
  );
}
