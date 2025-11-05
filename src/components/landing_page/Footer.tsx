import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import LogoIcon from "../../assets/ImagineboIcon.svg";

const socialIcons = [FaTwitter, FaYoutube];

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1116] text-white px-6 py-10 font-poppins">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Text */}
        <p className="text-2xl font-bold text-center md:text-left leading-snug">
          Take Your Brand <br /> Mobile.
        </p>

        {/* Social Icons
        <div className="flex gap-3">
          {socialIcons.map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="bg-[#1a1d21] p-2 rounded-md hover:text-pink-400 transition"
              aria-label={`Social link ${index}`}
            >
              <Icon size={16} />
            </a>
          ))}
        </div> */}
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-700" />

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={LogoIcon}
            alt="Imagine Logo"
            className="h-6 w-auto"
          />
          <span>imagine.bo</span>
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <a href="/terms" className="hover:text-white transition">
            Terms of Use
          </a>
          <a href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact Us
          </a>
        </div>

        {/* Copyright */}
        <div>© 2025 imagine.bo. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
