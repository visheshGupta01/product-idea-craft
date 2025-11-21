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
      "Tell us what you’re dreaming of—your product idea, the problem it solves...",
    image: card2,
  },
  {
    id: 2,
    title: "Plans with Purpose",
    content:
      "Imagine.bo doesn’t just generate—it thinks. Every response is backed...",
    image: card3,
  },
  {
    id: 3,
    title: "Support That Stays With You",
    content:
      "As your project takes shape, our team supports you through development...",
    image: card1,
  },
];

export default function StackedCards() {
  const wrapperRef = useRef(null);

  // Track scroll inside section
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={wrapperRef} className="relative h-[300vh] bg-gradient-bg">
      <div className="sticky top-20 h-screen flex items-center justify-center">
        {[...cardData].reverse().map((card, i) => {
          const realIndex = cardData.length - 1 - i;

          return (
            <SmoothCard
              key={card.id}
              card={card}
              index={realIndex}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </div>
    </div>
  );
}

function SmoothCard({ card, index, scrollYProgress }: any) {
  const start = index * 0.33;
  const end = start + 0.33;

  const top = useTransform(scrollYProgress, [start, end], [300, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    <motion.div
      style={{
        top,
        scale,
        opacity,
        zIndex: index, // later cards stack on top
        position: "absolute",
        left: 0,
        right: 0,
        margin: "0 auto",
      }}
      className="w-full max-w-4xl shadow-xl rounded-3xl overflow-hidden bg-[#B1C5CE]"
    >
      <div className={`flex h-[420px] ${index % 2 ? "flex-row-reverse" : ""}`}>
        {/* Image */}
        <div className="w-1/2 relative">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-[28px] font-semibold mb-4">{card.title}</h2>
          <p className="text-[17px] leading-relaxed">{card.content}</p>
        </div>
      </div>
    </motion.div>
  );
}
