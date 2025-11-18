import React from "react";
import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  sessionId?: string;
  onStreamingStateChange?: (isStreaming: boolean) => void;
  onToolProcessingChange?: (isProcessingTools: boolean) => void;
}

const ChatPanel = ({ 
  userIdea, 
  onFrontendGenerated, 
  onSitemapGenerated, 
  sessionId,
  onStreamingStateChange,
  onToolProcessingChange 
}: ChatPanelPropsExtended) => {
  return (
    <div className="h-full w-full">
      <StreamingChatInterface 
        userIdea={userIdea} 
        onFrontendGenerated={onFrontendGenerated} 
        onSitemapGenerated={onSitemapGenerated}
        urlSessionId={sessionId}
        onStreamingStateChange={onStreamingStateChange}
        onToolProcessingChange={onToolProcessingChange}
      />
    </div>
  );
};

export default ChatPanel;