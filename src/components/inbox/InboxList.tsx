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
        <div className="text-center py-8 text-muted-foreground">
          No conversations yet
        </div>
      ) : (
        tasks.map((task) => {
          const unreadCount = getUnreadCount(task);
          const isSelected = selectedTaskId === task.id;

          return (
            <Card
              key={task.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                isSelected ? "border-primary bg-accent/30" : ""
              }`}
              onClick={() => onSelectTask(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{task.title}</h3>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="shrink-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      <span>
                        {role === "user" || role === "admin"
                          ? `With ${task.assignee_name}`
                          : `With ${task.assigner_name}`}
                      </span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(task.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge variant={task.status === "done" ? "default" : "secondary"}>
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
