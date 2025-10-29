import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UI_CONFIG } from "@/utils/constants";
import { LoginModal } from "../auth/LoginModal";
import { SignupModal } from "../auth/SignupModal";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { FileUploader, UploadedFile } from "@/components/ui/file-uploader";
import { cn } from "@/lib/utils";

interface Tool {
  name: string;
  description: string;
}

const availableTools: Tool[] = [
  {
    name: "@analyse",
    description: "Analyze the provided text or code for insights.",
  },
  {
    name: "@research",
    description: "Conduct a web search to gather information on a topic.",
  },
  {
    name: "@icp",
    description: "Identify Ideal Customer Profile based on project details.",
  },
  { name: "@mvp", description: "Generate a Minimum Viable Product plan." },
  {
    name: "@sitemap",
    description:
      "Create a sitemap for a given website or application structure.",
  },
  {
    name: "@scope of work",
    description: "Define the scope of work for a project.",
  },
  {
    name: "@frontend code making",
    description: "Generate frontend code snippets or components.",
  },
  {
    name: "@backend code",
    description: "Generate backend code snippets or API logic.",
  },
];

const IdeaBox: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showToolList, setShowToolList] = useState(false);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [toolInput, setToolInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendIdeaWithAuth, setUserIdea, isProcessingIdea, isAuthenticated } =
    useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [idea]);

  const handleVoiceTranscript = (transcript: string) => {
    setIdea((prev) => (prev ? prev + " " + transcript : transcript));
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIdea(value);

    const atIndex = value.lastIndexOf("@");
    if (
      atIndex !== -1 &&
      (atIndex === 0 ||
        value[atIndex - 1] === " " ||
        value[atIndex - 1] === "\n")
    ) {
      const currentToolInput = value.substring(atIndex + 1);
      setToolInput(currentToolInput);
      const filtered = availableTools.filter((tool) =>
        tool.name.toLowerCase().includes(currentToolInput.toLowerCase())
      );
      setFilteredTools(filtered);
      setShowToolList(true);
    } else {
      setShowToolList(false);
      setToolInput("");
    }
  };

  const handleToolSelect = (tool: Tool) => {
    const atIndex = idea.lastIndexOf("@");
    if (atIndex !== -1) {
      const newIdea = idea.substring(0, atIndex) + tool.name + " ";
      setIdea(newIdea);
      setShowToolList(false);
      setToolInput("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleSubmit = async () => {
    if (!idea.trim() || isProcessingIdea) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Combine idea with uploaded file content
    let combinedIdea = idea.trim();
    if (uploadedFiles.length > 0) {
      const fileContents = uploadedFiles
        .map(
          (file) =>
            `\n\n--- Content from ${file.name} ---\n${file.extractedText}`
        )
        .join("\n");
      combinedIdea += fileContents;
    }

    const result = await sendIdeaWithAuth(combinedIdea);

    if (result.success && result.session_id) {
      navigate(`/chat/${result.session_id}`);
    } else {
      // Handle error
      //console.error("Failed to create session:", result.message);
      alert(result.message || "Failed to process your idea. Please try again.");
    }
  };

  return (
    <section
      id="idea-box"
      className="relative px-5 flex justify-center items-start bg-[#1B2123]"
    >
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
        <div className="bg-white w-full h-[238px] rounded-[35px] p-6 flex flex-col border border-black items-center justify-between relative overflow-hidden">
          {/* Input area with floating buttons */}
          <div className="relative w-full mb-4 font-poppins text-gray-800 flex-1 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={handleIdeaChange}
              placeholder="Type your idea or use '@' to call a tool, e.g., '@analyse', '@research'"
              className="w-full h-full px-4 py-3 pr-24 rounded-md bg-white text-sm focus:outline-none font-poppins resize-none overflow-y-auto"
              style={{
                border: "none",
                boxShadow: "none",
                outline: "none",
                textAlign: "left",
                minHeight: UI_CONFIG.IDEA_BOX_MAX_HEIGHT,
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isProcessingIdea) handleSubmit();
                }
              }}
              disabled={isProcessingIdea}
            />

            {/* Tool list opens DOWN and floats */}
            {showToolList && filteredTools.length > 0 && (
              <div
                className="absolute top-full left-0 mt-2 w-full 
        bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                {filteredTools.map((tool, index) => (
                  <div
                    key={tool.name}
                    className={cn(
                      "px-4 py-2 cursor-pointer flex flex-col items-start transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      index !== filteredTools.length - 1 &&
                        "border-b border-gray-100 dark:border-gray-800"
                    )}
                    onClick={() => handleToolSelect(tool)}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tool.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Floating buttons in top right */}
            <div className="absolute top-3 right-3 flex gap-2">
              <VoiceRecorder
                onTranscript={handleVoiceTranscript}
                disabled={isProcessingIdea}
              />
              <FileUploader
                onFileUploaded={handleFileUploaded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
                disabled={isProcessingIdea}
              />
            </div>
          </div>

          {/* Pink Button - Responsive */}
          <button
            onClick={handleSubmit}
            disabled={!idea.trim() || isProcessingIdea}
            className="absolute bottom-1 left-1 right-1 h-[50px] sm:h-[60px] bg-[#FF00A9] hover:bg-pink-600 disabled:cursor-not-allowed text-white rounded-[20px] sm:rounded-[27px] font-normal font-supply text-base sm:text-lg transition flex items-center justify-center gap-2"
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
