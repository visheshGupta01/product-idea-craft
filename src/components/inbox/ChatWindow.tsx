import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, InboxTask } from "@/services/inboxService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/avatarUtils";

interface ChatWindowProps {
  task: InboxTask;
  messages: ChatMessage[];
  currentUserId: string;
  currentRole: string;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isLoadingMessages: boolean;

  // ✅ NEW PROP
  onViewDeveloperProfile: (developerId: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  task,
  messages,
  currentUserId,
  currentRole,
  onSendMessage,
  isLoading,
  isLoadingMessages,
  onViewDeveloperProfile,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  /** ✅ HARD SAFETY GUARD */
  const safeMessages: ChatMessage[] = Array.isArray(messages) ? messages : [];

  /** ✅ Determine the OTHER person (developer) */
  const developerName =
    currentUserId === task.assignee_id
      ? task.assigner_name
      : task.assignee_name;

  const developerId =
    currentUserId === task.assignee_id
      ? task.assigner_id
      : task.assignee_id;

  const developerInitials = getInitials(developerName);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ EMIT developer id to parent
  const handleViewProfile = () => {
     

    onViewDeveloperProfile(developerId);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleViewProfile}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>{developerInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">
                Chatting with {developerName}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
          >
            <User className="h-4 w-4 mr-1" />
            View Profile
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {isLoadingMessages ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-16 w-3/4 rounded-lg" />
                </div>
              ))
            ) : safeMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                No messages yet
              </div>
            ) : (
              safeMessages.map((message) => {
                const isCurrentUser =
                  message.sender_id === currentUserId;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }
                      >
                        {isCurrentUser
                          ? getInitials(
                              currentUserId === task.assignee_id
                                ? task.assignee_name
                                : task.assigner_name
                            )
                          : developerInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`max-w-[75%] ${
                        isCurrentUser ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(
                          new Date(message.created_at),
                          { addSuffix: true }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none h-10"
              disabled={isLoading || isLoadingMessages}
            />
            <Button
              onClick={handleSend}
              disabled={!messageInput.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
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
