import React, { useState } from "react";
import topImage2 from "../../assets/822a470b3f92f4e89a684608248843b76ede5af2.jpg";
import sharedImage from "../../assets/408b142b8addbd9ba2f44202fa23d561c9035fec.jpg";
import sharedImage2 from "../../assets/55c057e645dba2c4c69d6f962c313a217ecfa537.jpg";

interface Project {
  title: string;
  description: string;
  image: string;
  bottomImage: string;
  runs?: string;
}

const projects: Project[] = [
  {
    title: "Taskflow Pro",
    description:
      "A productivity app that helps teams manage projects with AI-powered insights and automated workflows.",
    image: sharedImage2,
    bottomImage: sharedImage,
  },
  {
    title: "Artisan Hub",
    description:
      "A marketplace connecting local artisans with customers, featuring secure payments and community reviews.",
    image: topImage2,
    bottomImage: sharedImage2,
  },
  {
    title: "Mindful Moments",
    description: "AI-powered meditation & nutrition routines.",
    image: "",
    bottomImage: sharedImage,
  },
];

const CommunitySection: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <section className="bg-[#1B2123] text-white py-20 px-6 font-['Poppins']">
      {/* Heading */}
      <div className="text-center pt-8">
        <h2 className="text-6xl font-bold mb-3">
          <span className="block">Solutions by Our</span>
          <span className="block pt-4">Community</span>
        </h2>
      </div>

      {/* Top Cards */}
      <div className="flex justify-center gap-6 pt-20 px-4 relative flex-wrap">
        {projects.slice(0, 2).map((project, index) => (
          <div key={index} className="relative w-[484px]">
            {index === 0 ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="absolute -top-14 left-0 px-5 py-2 font-supply border text-white border-white rounded hover:bg-white hover:text-black transition-all duration-200 text-sm font-semibold"
                >
                  Recent ▾
                </button>
                {showDropdown && (
                  <div className="absolute top-[-4rem] left-0 mt-12 w-48 bg-white text-black border border-gray-300 rounded-md shadow-md z-20 font-supply">
                    <ul className="text-sm">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Latest
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Most Popular
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Trending
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button className="absolute -top-14 right-0 px-5 py-2 font-supply border text-white border-white rounded hover:bg-white hover:text-black transition-all duration-200 text-sm font-semibold">
                View All
              </button>
            )}

            <div className="bg-[#e4eff3] rounded-xl shadow-md h-[480px] flex flex-col overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-[320px] object-cover"
              />
              <div className="p-4 font-supply flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black">
                    {project.title}
                  </h3>
                  <p className="text-[14px] text-black mb-1">
                    {project.description}
                  </p>
                  {project.runs && (
                    <p className="text-[11px] text-[#FF007F] font-bold mt-1">
                      {project.runs}
                    </p>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <p className="text-[11px] text-gray-500">By John Doe</p>
                  <p className="text-[11px] text-gray-500">140 views</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="flex justify-center gap-6 px-6 pt-10 flex-wrap">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-[#e4eff3] rounded-xl shadow-md w-[400px] h-[420px] flex flex-col overflow-hidden"
          >
            <img
              src={project.bottomImage}
              alt={project.title}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-4 font-supply flex flex-col justify-between flex-grow">
              <h3 className="text-xl font-bold text-black text-left">
                {project.title}
              </h3>
              <div className="flex justify-between pt-4">
                <p className="text-[11px] text-gray-500">By John Doe</p>
                <p className="text-[11px] text-gray-500">140 views</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunitySection;
