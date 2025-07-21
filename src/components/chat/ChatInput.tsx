import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <div className="flex-1 relative">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message..."
          disabled={isLoading}
          className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-full h-12 px-6 pr-14 focus:border-gray-600 focus:ring-0"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!newMessage.trim() || isLoading}
        className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200 hover:shadow-lg p-0"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};