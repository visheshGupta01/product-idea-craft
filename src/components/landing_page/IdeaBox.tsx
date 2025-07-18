import React from "react";
import { Mic, Plus } from "lucide-react";

const IdeaBox: React.FC = () => {
  return (
    <section className="relative px-5 flex justify-center items-start bg-[#1B2123]">
      {/* Blue Box Behind the Black Box */}
      <div className="absolute bottom-0 w-full h-[220px] bg-[#d5e1e7] translate-y-[40%] z-0"></div>

      {/* Black Box */}
      <div className="relative bg-[#1b2123] w-full  border border-white max-w-[1000px] mx-auto rounded-[40px] shadow-xl flex flex-col items-center justify-start z-10">
        {/* Header Text */}
        <div className="py-[40px] flex items-center justify-center">
          <h2 className="text-[48px] font-medium font-['Poppins'] text-center mb-0">
            <span className="text-white">Let’s </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF512F] to-[#DD2476] to-[#8A38A5]">
              Build{" "}
            </span>
            <span className="text-white">Your Next </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF512F] to-[#EC10AC] to-[#803DD2] to-[#DD2476]">
              Big
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F45F44] to-[#EC10AC] to-[#803DD2] to-[#0770FD]">
              {" "}
              Idea!
            </span>
          </h2>
        </div>

        {/* White Input Area */}
        <div className="bg-white w-full h-[258px] rounded-[35px] p-6 flex flex-col border border-black items-center justify-between relative">
          {/* Input + icons row */}
          <div className="flex flex-col md:flex-row gap-4 items-center w-full mb-4 font-poppins text-customGray">
            <input
              type="text"
              placeholder="Start building your new idea by describing your application/website vision in detail."
              className="flex-1 mt-4 px-4 py-3 rounded-md text-sm focus:outline-none font-['Poppins']"
              style={{
                border: "none",
                boxShadow: "none",
                outline: "none",
                color: "customGray",
                textAlign: "left",
              }}
            />
            <div className="flex gap-2 items-center justify-center">
              <button className="p-3 w-12 h-12 flex items-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition justify-center">
                <Mic className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-3 w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition">
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Pink Button - flush bottom, left & right */}
          <button className="absolute bottom-0 left-1 right-1 h-[60px] bg-[#FF00A9] hover:bg-pink-600 text-white rounded-[27px] mb-1 font-normal font-supply text-lg transition">
            Start Building my Idea →
          </button>
        </div>
      </div>
    </section>
  );
};

export default IdeaBox;
