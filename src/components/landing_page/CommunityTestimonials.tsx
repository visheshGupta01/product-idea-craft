import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I went from idea to live site in under an hour—no code, no stress. The prompts felt like magic.",
    name: "Ankit S.",
    role: "SaaS Founder",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "Honestly, I didn't expect AI to get the layout this right. I still tweaked it, but it gave me a solid base to start from.",
    name: "Priya M.",
    role: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    quote:
      "It understood my target audience better than I expected. Landing page copy + structure = done in minutes.",
    name: "Jason T.",
    role: "Growth Marketer",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    quote: "Best AI tool I've used for prototyping. It saved us weeks of work.",
    name: "Maya K.",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote:
      "Turned my pitch into a landing page in one sitting. Super impressed.",
    name: "Ravi D.",
    role: "Startup Founder",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
  },
  {
    quote:
      "I loved how quickly I could test new ideas visually with AI support.",
    name: "Sara N.",
    role: "Marketing Strategist",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
  },
  {
    quote:
      "It makes non-designers feel like pros. Absolutely loving the output.",
    name: "Neha G.",
    role: "Tech Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
  },
  {
    quote: "We deployed a full MVP over a weekend using this. Game changer.",
    name: "Arun M.",
    role: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    quote: "User-friendly, powerful, and lightning fast to set up pages.",
    name: "Lily W.",
    role: "Content Strategist",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
  },
  {
    quote: "All my startup pages live in hours, not weeks. Huge time-saver.",
    name: "Vikram S.",
    role: "Founder",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    quote:
      "Felt like magic. Got feedback from early users same day I built it.",
    name: "Emily R.",
    role: "Design Lead",
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    quote: "AI + UI builder = a dream tool for busy solo founders like me.",
    name: "Karan J.",
    role: "Indie Hacker",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
  },
];

const CommunityTestimonials: React.FC = () => {
  const testimonialsPerSlide = 6;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleSlideChange = (newSlide: number) => {
    setDirection(newSlide > currentSlide ? 1 : -1);
    setCurrentSlide(newSlide);
  };

  const visibleTestimonials = testimonials.slice(
    currentSlide * testimonialsPerSlide,
    currentSlide * testimonialsPerSlide + testimonialsPerSlide
  );

  return (
    <section
      id="testimonies"
      className="mt-10 bg-gradient-to-b from-[#e4eff3] to-[#ffd9ec] text-black py-12 md:py-20 px-4 sm:px-6 font-['Poppins'] rounded-t-[24px]"
    >
      {/* Heading - Responsive */}
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
          Built with You, Backed by You
        </h2>

        {/* Community Box - Responsive */}
        <div className="bg-white border border-gray-300 rounded-xl py-4 md:py-6 px-4 md:px-8 max-w-5xl mx-auto mb-6 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-2 gap-4 sm:gap-0">
            <div className="flex items-center space-x-[-12px]">
              <img
                src="https://randomuser.me/api/portraits/men/11.jpg"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white"
                alt="Avatar 1"
              />
              <img
                src="https://randomuser.me/api/portraits/women/22.jpg"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white"
                alt="Avatar 2"
              />
              <img
                src="https://randomuser.me/api/portraits/lego/3.jpg"
                className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white"
                alt="Avatar 3"
              />
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs md:text-sm font-semibold">
                +1
              </div>
            </div>
            <button className="bg-[#ff0080] text-white font-semibold px-4 md:px-6 py-2 rounded-md text-xs md:text-sm">
              <a href="#idea-box"> Start Now</a>
            </button>
          </div>
          <p className="text-xs md:text-sm text-[#3366cc] text-center sm:text-left">
            We are creating an Imagine.bo Community, be part of it!
          </p>
        </div>
      </div>

      {/* Testimonials with carousel animation */}
      <div className="max-w-5xl mx-auto px-3 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{
              x: direction > 0 ? 1000 : -1000,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction > 0 ? -1000 : 1000,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5,
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {visibleTestimonials.slice(0, 3).map((t, idx) => (
                <motion.div
                  key={`${currentSlide}-${idx}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.3,
                  }}
                  className="bg-[#b3d4e0] rounded-[24px] text-base text-black font-poppins w-full min-h-[210px] flex flex-col items-center justify-center text-center px-4 py-6 hover:scale-105 transition-transform duration-200"
                >
                  <p className="mb-4 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-start mt-4 w-full max-w-[260px] gap-3">
                    <img
                      src={t.avatar}
                      className="w-10 h-10 rounded-full"
                      alt={t.name}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-gray-700">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {visibleTestimonials.slice(3, 6).map((t, idx) => (
                <motion.div
                  key={`${currentSlide}-${idx + 3}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: (idx + 3) * 0.1,
                    duration: 0.3,
                  }}
                  className="bg-[#b3d4e0] rounded-[24px] text-base text-black font-poppins w-full min-h-[210px] flex flex-col items-center justify-center text-center px-4 py-6 hover:scale-105 transition-transform duration-200"
                >
                  <p className="mb-4 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-start mt-4 w-full max-w-[260px] gap-3">
                    <img
                      src={t.avatar}
                      className="w-10 h-10 rounded-full"
                      alt={t.name}
                    />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-gray-700">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-10 space-x-3">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <motion.span
            key={i}
            onClick={() => handleSlideChange(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide ? "bg-pink-500 shadow-lg" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default CommunityTestimonials;
