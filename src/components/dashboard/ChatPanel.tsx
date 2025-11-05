import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  sessionId?: string;
}

const ChatPanel = ({ userIdea, onFrontendGenerated, onSitemapGenerated, sessionId }: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface 
        userIdea={userIdea} 
        onFrontendGenerated={onFrontendGenerated} 
        onSitemapGenerated={onSitemapGenerated}
        urlSessionId={sessionId} 
      />
    </div>
  );
};

export default ChatPanel;