import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  sessionId?: string;
}

const ChatPanel = ({ userIdea, onFrontendGenerated, sessionId }: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface userIdea={userIdea} onFrontendGenerated={onFrontendGenerated} urlSessionId={sessionId} />
    </div>
  );
};

export default ChatPanel;