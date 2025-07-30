import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

const ChatPanel = ({ userIdea }: ChatPanelProps) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface userIdea={userIdea} />
    </div>
  );
};

export default ChatPanel;