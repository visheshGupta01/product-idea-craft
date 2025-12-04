import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Star,
  Github,
  Linkedin,
  User,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  developerService,
  DeveloperInfo,
  CreateTaskData,
} from "@/services/developerService";
import { useToast } from "@/hooks/use-toast";
import ReviewDialog from "./ReviewDialog";

interface AssignToDeveloperProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

type ViewState = "list" | "profile" | "assign" | "success";

const AssignToDeveloper: React.FC<AssignToDeveloperProps> = ({
  isOpen,
  onClose,
  sessionId,
}) => {
  const [currentView, setCurrentView] = useState<ViewState>("list");
  const [developers, setDevelopers] = useState<DeveloperInfo[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] =
    useState<DeveloperInfo | null>(null);
  const [developerDetails, setDeveloperDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && currentView === "list") {
      fetchDevelopers();
    }
  }, [isOpen, currentView, currentPage]);

  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await developerService.getAllDevelopers(currentPage);
      //console.log('Developer Service Response:', response);

      const mapped = (
        Array.isArray(response) ? response : response?.data || []
      ).map((dev: any) => ({
        id: dev.id,
        name:
          [dev.first_name, dev.last_name].filter(Boolean).join(" ") ||
          dev.email.split("@")[0],
        avg_rating: dev.average_rating,
        total_done: dev.total_solved_tasks,
        bio: dev.bio,
        hourpaid: dev.hour_paid,
        skills: dev.skills || [],
        linkedin_url: dev.linkedin_url || "",
        github_url: dev.github_url || "",
        status: dev.status || "available",
        total_tasks: dev.total_tasks || 0,
        phone: dev.phone || "",
        image: dev.image || "",
        location: dev.location || "",
        created_at: dev.created_at || new Date().toISOString(),
        total_in_progress: dev.total_in_progress || 0,
        total_pending: dev.total_pending || 0,
        experience: dev.experience || "",
        rating_count: dev.rating_count || 0,
        email: dev.email || "",
      }));
      setDevelopers(mapped);
      //console.log('Fetched Developers:', Array.isArray(response) ? response : response?.data);
    } catch (error) {
      //console.error("Error fetching developers:", error);
      toast({
        title: "Error",
        description: "Failed to load developers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeveloperDetails = async (developerId: string) => {
    try {
      const details = await developerService.getDeveloperById(developerId);
      // console.log("Fetched Developer Details:", details);
      setDeveloperDetails(details);
    } catch (error) {
      //console.error("Error fetching developer details:", error);
      toast({
        title: "Error",
        description: "Failed to load developer details",
        variant: "destructive",
      });
    }
  };

  const handleDeveloperSelect = async (developer: DeveloperInfo) => {
    setSelectedDeveloper(developer);
    setCurrentView("profile");
    await fetchDeveloperDetails(developer.id);
  };

  const handleAssignClick = () => {
    setCurrentView("assign");
  };

  const handleAssignTask = async () => {
    if (!selectedDeveloper || !taskTitle.trim() || !taskDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const taskData: CreateTaskData = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        session_id: sessionId,
        assignee_id: selectedDeveloper.id,
        due_date: dueDate ? dueDate.toISOString() : undefined,
      };

      await developerService.createTask(taskData);
      setCurrentView("success");
    } catch (error) {
      //console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to assign task to developer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentView("list");
    setSelectedDeveloper(null);
    setDeveloperDetails(null);
    setTaskTitle("");
    setTaskDescription("");
    setDueDate(undefined);
    setCurrentPage(1);
    onClose();
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        )}
      />
    ));
  };

  const renderDeveloperList = () => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading developers...
        </div>
      ) : developers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No developers available
        </div>
      ) : (
        <>
          {developers.map((developer) => (
            <Card
              key={developer.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {developer?.name
                        ? developer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{developer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(developer.avg_rating)}
                      <span className="text-sm text-muted-foreground">
                        ({developer.avg_rating || 0}) • {developer.total_done}{" "}
                        Projects
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {developer.bio ||
                        "Full-stack developer with experience building scalable web applications."}
                    </p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {(
                        developer.skills || [
                          "React",
                          "Node.js",
                          "MongoDB",
                          "AWS",
                        ]
                      ).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs px-2 py-1 bg-pink-500 text-white"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="font-semibold">
                      ${developer.hourpaid || 0}/hr
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      Available Now
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeveloperSelect(developer);
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-black/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeveloper(developer);
                        setCurrentView("assign");
                      }}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Page {currentPage}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={developers.length < 10 || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderDeveloperProfile = () => {
    if (!selectedDeveloper || !developerDetails) return null;

    return (
      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("list")}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">
                {selectedDeveloper.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">
                {developerDetails.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {renderStars(developerDetails.rating)}
                <span className="text-sm text-muted-foreground">
                  ({developerDetails.rating || 0}) •{" "}
                  {developerDetails.task_complete} Projects
                </span>
              </div>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-semibold text-lg">
              ${developerDetails.hour_paid || 0}/hr
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <div
                className={`h-2 w-2 rounded-full ${
                  developerDetails.available ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {developerDetails.available ? "Available Now" : "Unavailable"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {developerDetails.bio ||
              "Full-stack developer with 6+ years of experience building scalable web applications. Passionate about technology and innovation, with experience in web development and design. Always eager to learn new skills and collaborate on exciting projects."}
          </p>

          <div className="flex gap-1 flex-wrap">
            {(developerDetails.skills || []).map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-pink-500 text-white"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">
              Reviews ({developerDetails.reviews.length || 0})
            </h3>
            <div className="space-y-3">
              {(developerDetails.reviews && developerDetails.reviews.length > 0
                ? developerDetails.reviews
                : []
              ).map((review: any, index: number) => (
                <div
                  key={index}
                  className="bg-background p-3 rounded-lg border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm">
                      {review.description || review.comment || "Great work!"}
                    </p>
                    <div className="flex ml-2">
                      {renderStars(review.rating || 5)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Client:{" "}
                    {review.client || review.reviewer_name || "Anonymous"} •{" "}
                    {review.date
                      ? new Date(review.date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : review.created_at
                      ? new Date(review.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recent"}{" "}
                  </div>
                </div>
              ))}
              {(!developerDetails.reviews ||
                developerDetails.reviews.length === 0) && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No reviews yet
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowReviewDialog(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignForm = () => {
    if (!selectedDeveloper) return null;

    return (
      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("profile")}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            Assign to {selectedDeveloper.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taskTitle">Task Title *</Label>
            <Input
              id="taskTitle"
              placeholder="Enter Task Details"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Deadline (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "mm/dd/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taskDescription">Description *</Label>
          <Textarea
            id="taskDescription"
            placeholder="Describe the task requirements..."
            className="min-h-24"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    if (!selectedDeveloper) return null;

    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">
              Request sent to {selectedDeveloper.name}
            </span>
            <Avatar className="h-6 w-6 ml-2">
              <AvatarFallback className="text-xs">
                {selectedDeveloper.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Button onClick={handleClose}>Close</Button>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "list":
        return renderDeveloperList();
      case "profile":
        return renderDeveloperProfile();
      case "assign":
        return renderAssignForm();
      case "success":
        return renderSuccess();
      default:
        return renderDeveloperList();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {currentView === "list" && "Assign to Developer"}
            {currentView === "profile" && "Developer Profile"}
            {currentView === "assign" && `Assign to ${selectedDeveloper?.name}`}
            {currentView === "success" && "Task Assigned Successfully"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {currentView === "list" && renderDeveloperList()}
          {currentView === "profile" && renderDeveloperProfile()}
          {currentView === "assign" && renderAssignForm()}
          {currentView === "success" && renderSuccess()}
        </div>

        {/* Fixed bottom buttons for profile and assign views */}
        {(currentView === "profile" || currentView === "assign") && (
          <div className="border-t pt-4 mt-4 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentView("list")}>
              {currentView === "profile" ? "Collapse" : "Back"}
            </Button>
            {currentView === "profile" && (
              <Button
                className="bg-black text-white hover:bg-black/90"
                onClick={handleAssignClick}
              >
                <User className="h-4 w-4 mr-2" />
                Assign
              </Button>
            )}
            {currentView === "assign" && (
              <Button
                className="bg-black text-white hover:bg-black/90"
                onClick={handleAssignTask}
                disabled={
                  loading || !taskTitle.trim() || !taskDescription.trim()
                }
              >
                <User className="h-4 w-4 mr-2" />
                {loading ? "Assigning Task..." : "Assign Task"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>

      {selectedDeveloper && (
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          developerId={selectedDeveloper.id}
          developerName={selectedDeveloper.name}
        />
      )}
    </Dialog>
  );
};

export default AssignToDeveloper;
  