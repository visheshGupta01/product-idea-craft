import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSubmit = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Clear input immediately
    console.log("Sending message:", messageToSend);
    await onSendMessage(messageToSend);
    // After sending, reset height to initial (e.g., 1 row)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow newline, do nothing else
        // The default behavior of Enter with Shift will insert a newline
      } else {
        e.preventDefault(); // Prevent default (newline) for plain Enter
        handleSubmit(); // Call handleSubmit without the event object
      }
    }
  };

  return (
    <div className="pb-6 bg-[#1E1E1E]">
      <div className="w-full">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#1A1F21] border-gray-600 text-white placeholder:text-gray-300 rounded-full py-3 px-4 pr-12 resize-none min-h-0 overflow-hidden"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-transparent text-white rounded-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 text-white h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
