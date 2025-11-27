import { ChatPanelProps } from "@/types";
import { StreamingChatInterface } from "@/components/chat/StreamingChatInterface";
import { ProjectDetails } from "@/services/projectService";

interface ChatPanelPropsExtended extends ChatPanelProps {
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  sessionId?: string;
  onStreamingStateChange?: (isStreaming: boolean) => void;
  onToolProcessingChange?: (isProcessingTools: boolean) => void;
  projectDetails?: ProjectDetails;
}

const ChatPanel = ({
  userIdea,
  onFrontendGenerated,
  onSitemapGenerated,
  sessionId,
  onStreamingStateChange,
  onToolProcessingChange,
  projectDetails,
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
        projectDetails={projectDetails}
      />
    </div>
  );
};

export default ChatPanel;
