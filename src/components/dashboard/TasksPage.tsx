import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

interface Task {
  ID: number;
  title: string;
  description: string;
  session_id: string;
  assignee_id: string;
  assigner_id: string;
  status: string | null;
  share_chat: string;
  chat_mode: boolean;
  due_date: string | null;
  created_at: string;
  assigner_name: string;
  assignee_name: string;
}

interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const UserTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("DESC");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTasks = async (
    page: number = 1,
    status: string = "",
    sort: string = "DESC"
  ) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(status && { status }),
        sort,
      });

      const response = await apiClient.get(
        `${API_ENDPOINTS.USER.TASKS}?${params.toString()}`
      );
      const data = response.data;
      //console.log('Fetched tasks:', data);
      setTasks(data || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      //console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1, statusFilter, sortOrder);
  }, [statusFilter, sortOrder]);

  const handleStatusChange = (status: string) => {
    let apiStatus = "";

    if (status === "all") {
      apiStatus = "";
    } else if (status === "pending") {
      apiStatus = "not_accepted"; // map pending to not_accepted
    } else {
      apiStatus = status;
    }

    setStatusFilter(apiStatus);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    loadTasks(page, statusFilter, sortOrder);
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Pending</Badge>;

    switch (status) {
      case "todo":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            To Do
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            In Progress
          </Badge>
        );
      case "done":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Done
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTasks = searchQuery
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignee_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === null).length;
    const todo = tasks.filter((task) => task.status === "todo").length;
    const inProgress = tasks.filter(
      (task) => task.status === "in_progress"
    ).length;
    const done = tasks.filter((task) => task.status === "done").length;

    return { total, pending, todo, inProgress, done };
  };

  const stats = getTaskStats();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">
            Track tasks assigned to developers
          </p>
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-72"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Newest First</SelectItem>
            <SelectItem value="ASC">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Task
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    {searchQuery
                      ? "No tasks found matching your search."
                      : "No tasks created yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.ID}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {task.description.length > 100
                            ? `${task.description.substring(0, 100)}...`
                            : task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{task.assignee_name}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{formatDate(task.due_date)}</TableCell>
                    <TableCell>{formatDate(task.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {task.share_chat && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(task.share_chat, "_blank")
                            }
                          >
                            View Chat
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserTasksPage;
