import React from "react";
import LogoIcon from "../../assets/ImagineboIcon.svg"; // Make sure TypeScript can import SVGs via module declaration

const HeroSection: React.FC = () => {
  return (
    <section className="text-white text-center px-4 sm:px-6 py-12 md:py-16 bg-[#1B2123] font-['Poppins']">
      {/* Logo Icon */}
      <div className="flex justify-center mt-8 md:mt-14 mb-4">
        <img
          src={LogoIcon}
          alt="Imagine.bo Logo"
          className="h-12 md:h-16 w-auto object-contain"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Imagine.bo Title Box - Responsive */}
      <div className="mx-auto mb-2 max-w-full flex items-center justify-center font-bold">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-semibold font-poppins leading-none">
          imagine.bo
        </h1>
      </div>

      {/* Tagline Box - Responsive */}
      <div className="max-w-full mx-auto mb-3 flex items-center justify-center font-supply font-light tracking-wider leading-loose px-4">
        <p className="text-white-400 text-lg sm:text-xl md:text-2xl lg:text-[30px] leading-loose font-supply font-thin bg-opacity-100 tracking-wider text-center">
          Turn your ideas into revenue-ready apps & websites
        </p>
      </div>

      {/* Powered by Tag */}
      <div className="border border-[#B1C5CE] inline-flex text-gray-300 items-center justify-center text-xs sm:text-sm rounded-[10px] mb-6 md:mb-10 px-2 py-1">
        Powered by AI & SDE * No coding required
      </div>
    </section>
  );
};

export default HeroSection;
