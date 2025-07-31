import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Message..."
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || disabled) return;

    const messageToSend = newMessage;
    setNewMessage("");
    onSendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="w-full">
        <div className="relative">
          <Input
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full py-3 px-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            disabled={false}
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-transparent text-white rounded-full shadow-sm"
          >
            {disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
