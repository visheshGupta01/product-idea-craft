import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  sessionId?: string;
  isLargeScreen?: boolean;
}

const ChatPanel = ({ userIdea, onFrontendGenerated, onSitemapGenerated, sessionId, isLargeScreen }: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full ">
      <StreamingChatInterface 
        userIdea={userIdea} 
        onFrontendGenerated={onFrontendGenerated} 
        onSitemapGenerated={onSitemapGenerated}
        urlSessionId={sessionId} 
        isLargeScreen={isLargeScreen}
      />
    </div>
  );
};

export default ChatPanel;