import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, InboxTask } from "@/services/inboxService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  task: InboxTask;
  messages: ChatMessage[];
  currentUserId: string;
  currentRole: string;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  task,
  messages,
  currentUserId,
  currentRole,
  onSendMessage,
  isLoading,
  isLoadingMessages,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-muted-foreground font-normal">
              {currentRole === "user" || currentRole === "admin"
                ? `Chatting with ${task.assignee_name}`
                : `Chatting with ${task.assigner_name}`}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {isLoadingMessages ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-16 w-3/4 rounded-lg" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <p className="font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.sender_id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent"}>
                        {isCurrentUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      } max-w-[75%]`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none min-h-[40px] max-h-[40px]"
              rows={2}
              disabled={isLoading || isLoadingMessages}
            />
            <Button
              onClick={handleSend}
              disabled={!messageInput.trim() || isLoading || isLoadingMessages}
              size="icon"
              className="shrink-0 h-auto"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
