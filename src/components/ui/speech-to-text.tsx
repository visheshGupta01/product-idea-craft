import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export interface TextToSpeechPanelRef {
  stopListening: () => void;
  getCurrentSpeech: () => string;
}

interface TextToSpeechPanelProps {
  isSimulationActive?: boolean;
  disabled?: boolean;
  className?: string;
  onTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
}

const TextToSpeechPanelComponent = forwardRef<
  TextToSpeechPanelRef,
  TextToSpeechPanelProps
>(
  (
    {
      isSimulationActive = false,
      disabled = false,
      className,
      onTranscript,
      onInterimTranscript,
    },
    ref
  ) => {
    const [isListening, setIsListening] = useState(false);
    const [finalSpeech, setFinalSpeech] = useState("");
    const [interimSpeech, setInterimSpeech] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
      if (isSimulationActive && !isListening) {
        startListening();
      }
    }, [isSimulationActive]);

    const startListening = () => {
      if (
        !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ) {
        //console.error("Speech recognition not supported");
        return;
      }

      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setFinalSpeech((prev) => {
            const updated = prev + final;
            onTranscript?.(final.trim());
            return updated;
          });
        }

        setInterimSpeech(interim);
        onInterimTranscript?.(interim);
      };

      recognition.onerror = (e) => {
        //console.error("Speech recognition error", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    };

    const stopListening = () => {
      recognitionRef.current?.stop();
      setIsListening(false);
    };

    useImperativeHandle(ref, () => ({
      stopListening,
      getCurrentSpeech: () => finalSpeech,
    }));

    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={cn(
          "transition-all duration-200 hover:scale-105",
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
            : "",
          className
        )}
        title={isListening ? "Stop recording" : "Start voice input"}
      >
        {isListening ? (
          <Square className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    );
  }
);

TextToSpeechPanelComponent.displayName = "TextToSpeechPanel";
export default TextToSpeechPanelComponent;
