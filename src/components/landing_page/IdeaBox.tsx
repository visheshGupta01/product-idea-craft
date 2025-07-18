import React, { useState } from "react";
import { Mic, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const IdeaBox: React.FC = () => {
  const [idea, setIdea] = useState("");
  const { setUserIdea } = useUser();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (idea.trim()) {
      setUserIdea(idea.trim());
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative px-5 flex justify-center items-start bg-[#1B2123]">
      {/* Blue Box Behind the Black Box */}
      <div className="absolute bottom-0 w-full h-[220px] bg-[#d5e1e7] translate-y-[40%] z-0"></div>

      {/* Black Box */}
      <div className="relative bg-[#1b2123] w-full  border border-white max-w-[1000px] mx-auto rounded-[40px] shadow-xl flex flex-col items-center justify-start z-10">
        {/* Header Text */}
        <div className="py-[40px] flex items-center justify-center">
          <h2 className="text-[48px] font-medium font-poppins text-center mb-0">
            <span className="text-white">Let’s </span>
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #F45F44, #EC10AC, #803DD2, #0770FD)",
              }}
            >
              Build{" "}
            </span>
            <span className="text-white">Your Next </span>
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #F45F44, #EC10AC, #803DD2, #0770FD)",
              }}
            >
              Big
            </span>
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #F45F44, #EC10AC, #803DD2, #0770FD)",
              }}
            >
              {" "}
              Idea!
            </span>
          </h2>
        </div>

        {/* White Input Area */}
        <div className="bg-white w-full h-[258px] rounded-[35px] p-6 flex flex-col border border-black items-center justify-between relative">
          {/* Input + icons row - Responsive */}
          <div className="flex flex-col gap-4 items-center w-full mb-4 font-poppins text-gray-800">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Start building your new idea by describing your application/website vision in detail."
              className="flex-1 w-full px-4 py-3 rounded-md bg-white text-sm focus:outline-none font-poppins resize-none"
              style={{
                border: "none",
                boxShadow: "none",
                outline: "none",
                textAlign: "left",
                minHeight: "80px",
              }}
              onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
            />
            <div className="flex gap-2 items-center justify-center w-full sm:w-auto">
              <button className="p-3 w-12 h-12 flex items-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition justify-center">
                <Mic className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-3 w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition">
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Pink Button - Responsive */}
          <button 
            onClick={handleSubmit}
            disabled={!idea.trim()}
            className="absolute bottom-1 left-1 right-1 h-[50px] sm:h-[60px] bg-[#FF00A9] hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[20px] sm:rounded-[27px] font-normal font-supply text-base sm:text-lg transition"
          >
            Start Building my Idea →
          </button>
        </div>
      </div>
    </section>
  );
};

export default IdeaBox;
