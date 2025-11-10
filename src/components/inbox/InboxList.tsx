import React from "react";
import { InboxTask } from "@/services/inboxService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";

interface InboxListProps {
  tasks: InboxTask[];
  selectedTaskId: number | null;
  onSelectTask: (task: InboxTask) => void;
  role: string;
}

export const InboxList: React.FC<InboxListProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  role,
}) => {
  const getUnreadCount = (task: InboxTask) => {
    return role === "user" || role === "admin"
      ? task.assigner_unread_count
      : task.assignee_unread_count;
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm">Your inbox is empty</p>
          </div>
        </div>
      ) : (
        tasks.map((task) => {
          const unreadCount = getUnreadCount(task);
          const isSelected = selectedTaskId === task.id;

          return (
            <Card
              key={task.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-accent" : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectTask(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate text-sm">{task.title}</h3>
                      {unreadCount > 0 && (
                        <Badge variant="default" className="shrink-0 h-5 px-2 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      <span className="truncate">
                        {role === "user" || role === "admin"
                          ? task.assignee_name
                          : task.assigner_name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline truncate">
                        {formatDistanceToNow(new Date(task.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={task.status === "done" ? "default" : "outline"} className="shrink-0 capitalize text-xs">
                    {task.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
