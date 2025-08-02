import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
}

const ChatPanel = ({ userIdea, onFrontendGenerated }: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface userIdea={userIdea} onFrontendGenerated={onFrontendGenerated} />
    </div>
  );
};

export default ChatPanel;