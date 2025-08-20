
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UI_CONFIG } from "@/utils/constants";
import { LoginModal } from "../auth/LoginModal";
import { SignupModal } from "../auth/SignupModal";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { FileUploader } from "@/components/ui/file-uploader";

const IdeaBox: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { sendIdeaWithAuth, setUserIdea, isProcessingIdea, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleVoiceTranscript = (transcript: string) => {
    setIdea(prev => prev ? prev + " " + transcript : transcript);
  };

  const handleFileTextExtracted = (extractedText: string) => {
    setIdea(prev => prev ? prev + "\n\n" + extractedText : extractedText);
  };

  const handleSubmit = async () => {
    if (!idea.trim() || isProcessingIdea) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const result = await sendIdeaWithAuth(idea.trim());
    
    if (result.success && result.session_id) {
      navigate(`/c/${result.session_id}`);
    } else {
      // Handle error
      console.error("Failed to create session:", result.message);
      alert(result.message || "Failed to process your idea. Please try again.");
    }
  };

  return (
    <section className="relative px-5 flex justify-center items-start bg-[#1B2123]">
      <div className="absolute bottom-0 w-full h-[220px] bg-[#d5e1e7] translate-y-[40%] z-0"></div>
      <div className="relative bg-[#1b2123] w-full border border-white max-w-[1000px] mx-auto rounded-[40px] shadow-xl flex flex-col items-center justify-start z-10">
        {/* Header Text */}
        <div className="py-[40px] flex items-center justify-center">
          <h2 className="text-[48px] font-medium font-poppins text-center mb-0">
            <span className="text-white">Let's </span>
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
        <div className="bg-white w-full h-[238px] rounded-[35px] p-6 flex flex-col border border-black items-center justify-between relative">
          {/* Input area with floating buttons */}
          <div className="relative w-full mb-4 font-poppins text-gray-800">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Start building your new idea by describing your application/website vision in detail."
              className="w-full px-4 py-3 pr-24 rounded-md bg-white text-sm focus:outline-none font-poppins resize-none"
              style={{
                border: "none",
                boxShadow: "none",
                outline: "none",
                textAlign: "left",
                minHeight: UI_CONFIG.IDEA_BOX_MAX_HEIGHT,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  if (!isProcessingIdea) handleSubmit();
                }
              }}
              disabled={isProcessingIdea}
            />
            {/* Floating buttons in top right */}
            <div className="absolute top-3 right-3 flex gap-2">
              <VoiceRecorder 
                onTranscript={handleVoiceTranscript}
                disabled={isProcessingIdea}
              />
              <FileUploader 
                onTextExtracted={handleFileTextExtracted}
                disabled={isProcessingIdea}
              />
            </div>
          </div>

          {/* Pink Button - Responsive */}
          <button
            onClick={handleSubmit}
            disabled={!idea.trim() || isProcessingIdea}
            className="absolute bottom-1 left-1 right-1 h-[50px] sm:h-[60px] bg-[#FF00A9] hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[20px] sm:rounded-[27px] font-normal font-supply text-base sm:text-lg transition flex items-center justify-center gap-2"
          >
            {isProcessingIdea ? (
              <LoadingSpinner size="sm" text="Processing your idea" />
            ) : (
              "Start Building my Idea →"
            )}
          </button>
        </div>
      </div>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </section>
  );
};

export default IdeaBox;
