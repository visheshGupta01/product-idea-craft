import React from "react";
import LogoIcon from "../../assets/ImagineboIcon.svg"; // Make sure TypeScript can import SVGs via module declaration

const HeroSection: React.FC = () => {
  return (
    <section className="text-white text-center px-6 py-16 bg-[#1B2123] font-['Poppins']">
      {/* Logo Icon (73.81 × 100) */}
      <div className="flex justify-center mt-14 mb-4">
        <img
          src={LogoIcon}
          alt="Imagine.bo Logo"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Imagine.bo Title Box (1222 × 105) */}
      <div className="mx-auto mb-2 w-[1222px] h-[105px] flex items-center justify-center font-bold">
        <h1 className="text-[70px] font-semibold font-poppins leading-none">
          Imagine.bo
        </h1>
      </div>

      {/* Tagline Box (1204 × 52) */}
      <div className="w-[1024px] h-[30px] mx-auto mb-3 flex items-center justify-center font-supply font-light tracking-wider leading-loose text-[30px]">
        <p className="text-white-400 text-[30px] leading-loose font-supply font-thin bg-opacity-100 tracking-wider">
          Turn your ideas into revenue-ready apps & websites
        </p>
      </div>

      {/* Powered by Tag (567 × 44) */}
      <div className="border border-[#B1C5CE] inline-flex  text-gray-300  items-center justify-center text-sm rounded-[10px] mb-10 px-2 py-1 ">
        Powered by AI & SDE * No coding required
      </div>
    </section>
  );
};

export default HeroSection;
