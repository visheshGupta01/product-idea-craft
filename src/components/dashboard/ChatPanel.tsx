import React from "react";
import { StreamingChatInterface } from "../chat/StreamingChatInterface";
import { useUser } from "../../context/UserContext";

interface ChatPanelProps {
  userIdea?: string;
}

const ChatPanel = ({ userIdea }: ChatPanelProps) => {
  const { sessionId } = useUser();
  
  return (
    <div className="h-full w-full">
      <StreamingChatInterface sessionId={sessionId || ''} />
    </div>
  );
};

export default ChatPanel;