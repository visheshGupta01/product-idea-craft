
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import TextToSpeechPanelComponent, {
  TextToSpeechPanelRef,
} from "@/components/ui/speech-to-text";

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

  const handleSpeechTranscript = (transcript: string) => {
    setIdea(idea + (idea ? " " : "") + transcript);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          What's your next big idea?
        </h2>
        <p className="text-muted-foreground">
          Transform your vision into reality with AI-powered development
        </p>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Describe your app or website idea in detail..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isSubmitting}
          className="min-h-[120px] resize-none border-2 focus:border-primary/50 rounded-xl px-4 py-3 transition-all duration-300"
        />
        <div className="absolute top-3 right-3">
          <TextToSpeechPanelComponent
            ref={speechRef}
            onTranscript={handleSpeechTranscript}
            onInterimTranscript={() => {}}
            disabled={isSubmitting}
            className="h-8 w-8"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!idea.trim() || isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
            <span>Processing your idea...</span>
          </div>
        ) : (
          <span>Start Building 🚀</span>
        )}
      </button>
    </div>
  );
};

export default IdeaSubmissionForm;
