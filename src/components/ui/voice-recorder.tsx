import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios"; // ✅ Import axios
import apiClient from "@/lib/apiClient";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscript,
  disabled = false,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await sendAudioToBackend(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("video", audioBlob, "recording.wav");

      // ✅ axios POST request
      const response = await apiClient.post("/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      if (result.success && result.text) {
        onTranscript(result.text);
      } else {
        throw new Error("No transcript received");
      }
    } catch (error) {
      console.error("Failed to process audio:", error);
      alert(
        "Failed to transcribe audio. Please make sure the backend server is running on localhost:8000"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getButtonStyle = () => {
    if (isProcessing) return "bg-yellow-500 hover:bg-yellow-600";
    if (isRecording) return "bg-red-500 hover:bg-red-600 animate-pulse";
    return "bg-gray-100 hover:bg-gray-200";
  };

  const getIconColor = () => {
    if (isProcessing || isRecording) return "text-white";
    return "text-gray-700";
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        "p-2 w-[40px] h-[40px] flex items-center justify-center border border-gray-300 rounded-md transition",
        getButtonStyle(),
        className
      )}
      title={
        isProcessing
          ? "Processing audio..."
          : isRecording
          ? "Stop recording"
          : "Start voice input"
      }
    >
      {isProcessing ? (
        <Loader2
          className={cn("w-[20px] h-[20px] animate-spin", getIconColor())}
        />
      ) : isRecording ? (
        <Square className={cn("w-[20px] h-[20px]", getIconColor())} />
      ) : (
        <Mic className={cn("w-[20px] h-[20px]", getIconColor())} />
      )}
    </Button>
  );
};
