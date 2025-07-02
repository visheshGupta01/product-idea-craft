
import React, { useRef, useState, useEffect } from "react";
import TextToSpeechPanelComponent, {
  TextToSpeechPanelRef,
} from "@/components/ui/speech-to-text"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Upload, Mic, X } from "lucide-react";

interface IdeaSubmissionFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const IdeaSubmissionForm = ({
  idea,
  setIdea,
  isSubmitting,
  onSubmit,
}: IdeaSubmissionFormProps) => {
  const speechRef = useRef<TextToSpeechPanelRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [userTyped, setUserTyped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleSpeechTranscript = (transcript: string) => {
    const newIdea = idea + (idea ? " " : "") + transcript;
    setIdea(newIdea);
    setLiveTranscript("");
    setUserTyped(false); // allow live speech to continue updating after final
    setIsRecording(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const removeFile = (fileToRemove: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey && !isSubmitting && idea.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Listen for recording state changes
  useEffect(() => {
    const checkRecordingState = () => {
      // This is a simple way to detect if recording is active
      // You might need to modify the speech component to expose this state
      const micButton = document.querySelector('[title="Start voice input"], [title="Stop recording"]');
      if (micButton) {
        const isCurrentlyRecording = micButton.getAttribute('title')?.includes('Stop');
        setIsRecording(!!isCurrentlyRecording);
      }
    };

    const interval = setInterval(checkRecordingState, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 animate-fade-up">
      <div className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            What's your next big idea?
          </h2>
          <p className="text-muted-foreground">
            Transform your vision into reality with AI-powered development
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload Display */}
          {uploadedFiles.length > 0 && (
            <div className="bg-muted/50 rounded-2xl p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Uploaded Files</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((fileName, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-background/80 rounded-lg px-3 py-1 text-sm border border-border/20"
                  >
                    <span className="text-foreground/80">{fileName}</span>
                    <button
                      onClick={() => removeFile(fileName)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <Textarea
              placeholder="Describe your app or website idea in detail... (Press Shift+Enter to submit)"
              value={
                userTyped
                  ? idea
                  : idea + (liveTranscript ? " " + liveTranscript : "")
              }
              onChange={(e) => {
                setUserTyped(true); // user typed manually, stop auto appending
                setIdea(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="min-h-[120px] text-base resize-none pr-24"
            />

            <div className="absolute top-3 right-3 flex items-center gap-2">
              {/* Upload Button */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="h-8 w-8 hover:scale-105 transition-all duration-200"
                title="Upload files"
              >
                <Upload className="w-4 h-4" />
              </Button>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Voice Input with Smooth Wave Animation */}
              <div className="relative">
                {isRecording && (
                  <>
                    {/* Smooth wave animation rings */}
                    <div className="absolute -inset-3 rounded-full animate-ping bg-primary/20 animation-delay-0"></div>
                    <div className="absolute -inset-2 rounded-full animate-pulse bg-primary/30 animation-delay-300"></div>
                    <div className="absolute -inset-1 rounded-full animate-ping bg-primary/40 animation-delay-600"></div>
                  </>
                )}
                <TextToSpeechPanelComponent
                  ref={speechRef}
                  onTranscript={handleSpeechTranscript}
                  onInterimTranscript={(transcript) => {
                    setLiveTranscript(transcript);
                    setIsRecording(!!transcript);
                  }}
                  disabled={isSubmitting}
                  className="h-8 w-8 relative z-10"
                />
                {isRecording && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-current rounded-full animate-pulse"></div>
                        <div className="w-1 h-4 bg-current rounded-full animate-pulse animation-delay-100"></div>
                        <div className="w-1 h-3 bg-current rounded-full animate-pulse animation-delay-200"></div>
                      </div>
                      <span>Recording...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!idea.trim() || isSubmitting}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-xl group transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                Processing your idea...
              </>
            ) : (
              <>
                Start Building My Idea
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Your idea is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
