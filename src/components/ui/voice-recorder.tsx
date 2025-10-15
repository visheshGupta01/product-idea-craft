import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from '@/config/api';

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

      // apiClient POST request
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD.AUDIO, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      console.log(result);

      if (result.success && result.text) {
        console.log("Transcribed text:", result.text);
        onTranscript(result.text);
      } else {
        throw new Error("No transcript received");
      }
    } catch (error) {
      console.log("Audio upload error:", error);
      console.error("Failed to process audio:", error);
      alert(
        "Failed to transcribe audio."
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
    if (isProcessing) return "bg-accent hover:bg-accent/90";
    if (isRecording) return "bg-destructive hover:bg-destructive/90 animate-pulse";
    return "bg-white hover:bg-white border border-sidebar-border";
  };

  const getIconColor = () => {
    if (isProcessing || isRecording) return "text-black";
    return "text-sidebar-accent";
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        "w-[36px] h-[36px] flex items-center justify-center rounded-md transition-colors",
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
          className={cn("w-4 h-4 animate-spin", getIconColor())}
        />
      ) : isRecording ? (
        <Square className={cn("w-4 h-4", getIconColor())} />
      ) : (
        <Mic className={cn("w-4 h-4", getIconColor())} />
      )}
    </Button>
  );
};
