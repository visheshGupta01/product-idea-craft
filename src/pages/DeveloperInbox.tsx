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

const DeveloperInbox: React.FC = () => {
  const [tasks, setTasks] = useState<InboxTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<InboxTask | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [role, setRole] = useState("developer");
  const { toast } = useToast();
  const { user } = useUser();
  const [wsService] = useState(() => new SupportWebSocketService());
   const location = useLocation();
 const preselectedTaskId = (location.state as { taskId?: number })?.taskId;

  const fetchInbox = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await inboxService.getDeveloperInbox(currentPage);
      //console.log(data);
      setTasks(data.tasks || []);
      setRole(data.Role);
      setTotalPages(Math.ceil((data.total || 0) / 20));
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
    async (taskId: number) => {
      try {
        setIsLoadingMessages(true);
        const data = await inboxService.getChatMessages(taskId);
        //console.log(data);
        setMessages(data || []);
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
    if (tasks.length === 0) return;
    if (!openTaskId) return;

    const found = tasks.find((t) => t.id === openTaskId);
    if (found) {
      setSelectedTask(found);
      fetchMessages(found.id);
    }
  }, [tasks, openTaskId, fetchMessages]);

   useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

 // Auto-select task if we came from "Message" button
 useEffect(() => {
   if (!preselectedTaskId || !tasks.length || selectedTask) return;

   const taskToOpen = tasks.find((t) => t.id === preselectedTaskId);
   if (taskToOpen) {
     setSelectedTask(taskToOpen);
     fetchMessages(taskToOpen.id);
   }
 }, [preselectedTaskId, tasks, selectedTask, fetchMessages]);
  
  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = localStorage.getItem("auth_token") || "";
        wsService.setToken(token);
        await wsService.connect(token);
        wsService.onMessage((data) => {
          //console.log("Received WebSocket message:", data);
          if (
            data.task_id &&
            selectedTask &&
            data.task_id === selectedTask.id
          ) {
            setMessages((prev) => [...prev, data]);
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

  const handleSelectTask = (task: InboxTask) => {
    setSelectedTask(task);
    fetchMessages(task.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedTask || !user?.id) return;

    setIsSending(true);
    try {
      const receiverId =
        role === "developer"
          ? selectedTask.assigner_id
          : selectedTask.assignee_id;

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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
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

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
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

export default DeveloperInbox;
