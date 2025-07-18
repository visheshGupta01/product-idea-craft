import React from "react";
import Logo from "../assets/ImagineboDarkBackground.svg"; // Adjust if needed

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#1B2123] shadow-[0_8px_24px_rgba(0,0,0,0.5)] fixed top-0 left-0 w-full z-50">
      <div className="max-w-[1732px] mx-auto h-[60px] px-6 flex items-center justify-between">
        {/* Logo */}
        <div>
          <img
            src={Logo}
            alt="Imagine.bo"
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Menu items */}
        <div className="flex gap-10 text-white text-[12px] font-medium font-supply">
          <a href="#about" className="hover:text-pink-400 transition">
            About Us
          </a>
          <a href="#community" className="hover:text-pink-400 transition">
            Community
          </a>
          <a href="#pricing" className="hover:text-pink-400 transition">
            Pricing
          </a>
          <a href="#testimonies" className="hover:text-pink-400 transition">
            Testimonies
          </a>
        </div>

        {/* Login | Sign Up block */}
        <div className="w-[220px] h-[30px] flex items-center rounded-[7px] shadow-md overflow-hidden font-supply bg-[#D5E1E7]">
          <button className="w-1/2 h-full text-black text-sm font-medium hover:bg-gray-100 transition">
            Login
          </button>
          <div className="w-[1px] h-[70%] bg-black" />
          <button className="w-1/2 h-full text-black text-sm font-medium hover:bg-gray-100 transition">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
