import React, { useState, useEffect, useCallback } from "react";
import { inboxService, InboxTask, ChatMessage } from "@/services/inboxService";
import { SupportWebSocketService } from "@/services/supportWebSocket";
import { InboxList } from "@/components/inbox/InboxList";
import { ChatWindow } from "@/components/inbox/ChatWindow";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const UserInbox: React.FC = () => {
  const [tasks, setTasks] = useState<InboxTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<InboxTask | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
const [messagesPage, setMessagesPage] = useState(1);
const [hasMoreMessages, setHasMoreMessages] = useState(true);


  const [role, setRole] = useState("user");
  const { toast } = useToast();
  const { user } = useUser();
  const [wsService] = useState(() => new SupportWebSocketService());
  const location = useLocation(); 
  const openTaskId = location.state?.task || null;
  const preselectedTaskId = (location.state as { taskId?: number })?.taskId;
    //console.log(location.state,"hgf");
    

  const fetchInbox = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await inboxService.getUserInbox(currentPage);
      setTasks(data.tasks || []);
      setRole(data.Role);
      //setTotalPages(Math.ceil((data.total || 0) / 20));
          setHasMore(Boolean(data?.has_more)); 
    } catch (error) {
      //console.error("Failed to fetch inbox:", error);
      toast({
        title: "Error",
        description: "Failed to load inbox",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast]);

  const fetchMessages = useCallback(
    async (taskId: number,page = 1, reset = false) => {
      try {
        setIsLoadingMessages(true);
        const data = await inboxService.getChatMessages(taskId,page);
        console.log(data);
        setMessages((prev) =>
        reset ? data.messages : [...data.messages, ...prev]
      );

      setHasMoreMessages(Boolean(data.has_more));
      setMessagesPage(page);

      } catch (error) {
        //console.error("Failed to fetch messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [toast]
  );
  
  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = localStorage.getItem("auth_token") || "";
        wsService.setToken(token);
        await wsService.connect(token);
        wsService.onMessage((data: any) => {
          if (
            data &&
            typeof data === "object" &&
            "task_id" in data &&
            "content" in data &&
            selectedTask &&
            data.task_id === selectedTask.id
          ) {
            setMessages((prev) => [...prev, data as ChatMessage]);
          }
          // Refresh inbox to update unread counts
          fetchInbox();
        });
      } catch (error) {
        //console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, [wsService, selectedTask, fetchInbox]);

  useEffect(() => {
    console.log("Tasks updated:", tasks);
    console.log("Open Task ID:", openTaskId);
    console.log("Selected Task:", selectedTask);
    console.log("Messages:", messages);
    console.log("Preselected Task ID:", preselectedTaskId);
  if (!tasks.length || !openTaskId) return;

  const found = tasks.find((t) => t.id === openTaskId);
  if (found) {
    setSelectedTask(found);
    setMessages([]);
    setMessagesPage(1);
    setHasMoreMessages(true);
    fetchMessages(found.id, 1, true);
  }
}, [tasks, openTaskId, fetchMessages]);


 const handleSelectTask = (task: InboxTask) => {
  setSelectedTask(task);
  setMessages([]);
  setMessagesPage(1);
  setHasMoreMessages(true);
  fetchMessages(task.id, 1, true);
};


  const handleSendMessage = async (content: string) => {
    if (!selectedTask || !user?.id) return;

    setIsSending(true);
    //console.log("Sending message:", content);
    try {
      const receiverId =
        role === "user" || role === "admin"
          ? selectedTask.assignee_id
          : selectedTask.assigner_id;
      //console.log("Receiver ID:", receiverId);
      //console.log("Sender ID:", user.id);
      //console.log("Role:", role);
      wsService.sendMessage({
        content: content,
        task_id: selectedTask.id,
        sender_id: user.id,
        receiver_id: receiverId,
        role: role,
      });

      // Optimistically add message
      const newMessage: ChatMessage = {
        id: Date.now(),
        task_id: selectedTask.id,
        role: role,
        sender_id: user.id,
        receiver_id: receiverId,
        content: content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      //console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="pt-[60px] flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-[90px] container mx-auto p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden min-h-0">
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <InboxList
              tasks={tasks}
              selectedTaskId={selectedTask?.id || null}
              onSelectTask={handleSelectTask}
              role={role}
            />
          </div>

          {!isLoading && tasks.length > 0 && (
  <div className="flex justify-center gap-4 mt-4 pt-4 border-t">
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    >
      Previous
    </Button>

    <span className="px-4 py-2 text-sm text-muted-foreground">
      Page {currentPage}
    </span>

    <Button
      variant="outline"
      size="sm"
      disabled={!hasMore}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Next
    </Button>
  </div>
)}

        </div>

        <div className="lg:col-span-2 min-h-0">
          {selectedTask ? (
            <ChatWindow
              task={selectedTask}
              messages={messages}
              currentUserId={user?.id || ""}
              currentRole={role}
              onSendMessage={handleSendMessage}
              isLoading={isSending}
              isLoadingMessages={isLoadingMessages}
              hasMoreMessages={hasMoreMessages}
  onLoadMore={() =>
    fetchMessages(
      selectedTask.id,
      messagesPage + 1,
      false
    )
  }
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/20">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInbox;
