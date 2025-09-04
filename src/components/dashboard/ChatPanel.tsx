import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  onSitemapUpdated?: (newSitemap: any) => void;
  sessionId?: string;
}

const ChatPanel = ({ userIdea, onFrontendGenerated, onSitemapUpdated, sessionId }: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface 
        userIdea={userIdea} 
        onFrontendGenerated={onFrontendGenerated} 
        onSitemapUpdated={onSitemapUpdated}
        urlSessionId={sessionId} 
      />
    </div>
  );
};

export default ChatPanel;