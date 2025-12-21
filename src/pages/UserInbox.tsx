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
import AssignToDeveloper from "@/components/dashboard/AssignToDeveloper";

const UserInbox: React.FC = () => {
  const [tasks, setTasks] = useState<InboxTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<InboxTask | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [role, setRole] = useState("user");

  const { toast } = useToast();
  const { user } = useUser();
  const [wsService] = useState(() => new SupportWebSocketService());
  const location = useLocation();

  const preselectedTaskId = (location.state as { taskId?: number })?.taskId;

  // ✅ New state for AssignToDeveloper modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(null);

  /* -------------------- Inbox -------------------- */
  const fetchInbox = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await inboxService.getUserInbox(currentPage);
      setTasks(Array.isArray(data?.tasks) ? data.tasks : []);
      setRole(data?.Role || "user");
      setTotalPages(Math.ceil((data?.total || 0) / 20));
    } catch {
      toast({
        title: "Error",
        description: "Failed to load inbox",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, toast]);

  /* -------------------- Messages -------------------- */
  const fetchMessages = useCallback(
    async (taskId: number) => {
      try {
        setIsLoadingMessages(true);
        const response = await inboxService.getChatMessages(taskId);
        const normalizedMessages: ChatMessage[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.messages)
          ? response.messages
          : [];
        setMessages(normalizedMessages);
      } catch {
        setMessages([]);
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

  /* -------------------- WebSocket -------------------- */
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
            setMessages((prev) =>
              Array.isArray(prev) ? [...prev, data] : [data]
            );
          } else {
            fetchInbox();
          }
        });
      } catch {}
    };

    connectWebSocket();
    return () => wsService.disconnect();
  }, [wsService, selectedTask, fetchInbox]);

  /* -------------------- Preselect -------------------- */
  useEffect(() => {
    if (!preselectedTaskId || tasks.length === 0 || selectedTask) return;

    const found = tasks.find((t) => t.id === preselectedTaskId);
    if (found) {
      setSelectedTask(found);
      fetchMessages(found.id);
    }
  }, [tasks, preselectedTaskId, selectedTask, fetchMessages]);

  const handleSelectTask = (task: InboxTask) => {
    setSelectedTask(task);
    setMessages([]);
    fetchMessages(task.id);
  };

  /* -------------------- Send Message -------------------- */
  const handleSendMessage = async (content: string) => {
    if (!selectedTask || !user?.id) return;

    setIsSending(true);
    try {
      const receiverId =
        role === "user" || role === "admin"
          ? selectedTask.assignee_id
          : selectedTask.assigner_id;

      wsService.sendMessage({
        content,
        task_id: selectedTask.id,
        sender_id: user.id,
        receiver_id: receiverId,
        role,
      });

      const newMessage: ChatMessage = {
        id: Date.now(),
        task_id: selectedTask.id,
        role,
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) =>
        Array.isArray(prev) ? [...prev, newMessage] : [newMessage]
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  /* -------------------- Handle Developer Profile -------------------- */
  const handleViewDeveloperProfile = (developerId: string) => {
    setSelectedDeveloperId(developerId);
    setIsAssignModalOpen(true);
  };

  /* -------------------- Loading -------------------- */
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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <InboxList
            tasks={tasks}
            selectedTaskId={selectedTask?.id || null}
            onSelectTask={handleSelectTask}
            role={role}
          />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 border-t pt-4">
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
              onViewDeveloperProfile={handleViewDeveloperProfile} // ✅ add this
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/20">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      {/* ✅ AssignToDeveloper Modal */}
      {selectedTask &&  (
        <AssignToDeveloper
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          sessionId={selectedTask.id.toString()}
          initialDeveloperId={selectedDeveloperId} // pass developerId from chat
        />
      )}
    </div>
  );
};

export default UserInbox;
