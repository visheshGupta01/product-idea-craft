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
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Star,
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
   ReviewsResponse,
} from "@/services/developerService";
import { useToast } from "@/hooks/use-toast";
import ReviewDialog from "./ReviewDialog";
import { useParams, useNavigate } from "react-router-dom";


interface AssignToDeveloperProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
   initialDeveloperId?: string; // ✅ add this line
}

type ViewState = "list" | "profile" | "assign" | "success";

const AssignToDeveloper: React.FC<AssignToDeveloperProps> = ({
  isOpen,
  onClose,
  sessionId,
   initialDeveloperId, // ✅ add this here
}) => {
  const [currentView, setCurrentView] = useState<ViewState>("list");
  const [developers, setDevelopers] = useState<DeveloperInfo[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] =
    useState<DeveloperInfo | null>(null);
  const [developerDetails, setDeveloperDetails] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);



  const [loading, setLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
    const { id: developerIdFromRoute } = useParams<{ id: string }>();
  const navigate = useNavigate();

  
  const [developerReviews, setDeveloperReviews] = useState<ReviewsResponse | null>(null);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedReviewPage, setSelectedReviewPage] = useState(1);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Add this mapping function somewhere at the top of your file
// TypeScript-safe function to map backend developer data to DeveloperInfo
const mapBackendDeveloperToFrontend = (details: any, id: string): DeveloperInfo => {
  return {
    id: id,
    name: details.Name || "Unknown",
    avg_rating: details.Rating ?? 0,
    total_done: details.TaskComplete ?? 0,
    bio: details.Bio ?? "",
    hourpaid: details.HourPaid ?? 0,
    skills: details.Skills ?? [],
    status: details.Available ?? false, // map Available → status
    experience: details.Experience ?? 0,
    rating_count: details.RatingCount ?? 0,
    linkedin_url: "", // default empty if backend doesn’t send
    github_url: "",   // default empty if backend doesn’t send
    total_tasks: 0,   // default empty if backend doesn’t send
    total_in_progress: 0,
    total_pending: 0,
    email: "",
  };
};



  useEffect(() => {
    if (isOpen && currentView === "list") {
      fetchDevelopers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentView, currentPage]);

useEffect(() => {
  if (isOpen && initialDeveloperId) {
    selectDeveloperById(initialDeveloperId);
  }
}, [isOpen, initialDeveloperId]);




  useEffect(() => {
  if (developerIdFromRoute) {
    selectDeveloperById(developerIdFromRoute);
  }
}, [developerIdFromRoute]);


  const fetchDevelopers = async () => {
    setLoading(true);
    try {
      const response = await developerService.getAllDevelopers(currentPage);

      const mapped = (
        Array.isArray(response) ? response : response?.data || []
      ).map((dev: any) => ({
        id: dev.id,
        name:
          [dev.first_name, dev.last_name].filter(Boolean).join(" ") ||
          (dev.email ? dev.email.split("@")[0] : "Unknown"),
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
        experience: dev.experience || 0,
        rating_count: dev.rating_count || 0,
        email: dev.email || "",
      }));
      setDevelopers(mapped);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load developers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview: any) => {
    setDeveloperReviews((prev: any) => ({
      ...prev,
      total_review: (prev.total_review || 0) + 1,
      review: [newReview, ...(prev.review || [])], // 👈 prepend
    }));
  };


  const fetchDeveloperDetails = async (developerId: string) => {
  setLoading(true);
  try {
    const details = await developerService.getDeveloperById(developerId);
    setDeveloperDetails(details); // keep this
    return details; // ✅ return details so the useEffect can set selectedDeveloper
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load developer details",
      variant: "destructive",
    });
    return null;
  } finally {
    setLoading(false);
  }
};

  const fetchDeveloperReviews = async (developerId: string, page: number) => {
    setReviewLoading(true);
    try {
      const reviews = await developerService.getReviews(developerId, page);
      console.log("Fetched reviews:", reviews);
      return reviews
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load developer details",
        variant: "destructive",
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReviewViewMore = async (page: number) => {
    if (selectedDeveloper) {
      const reviews = await fetchDeveloperReviews(selectedDeveloper.id, page);
      setSelectedReviewPage(page);
      setDeveloperReviews((prev: any) => ({
        ...prev,
        review: [...(prev.review || []), ...(reviews?.review || [])],
        HasMore: reviews?.HasMore,
      }));
      console.log("Fetched reviews:", reviews);
      console.log("Updated reviews state:", developerReviews);
    }
  };

const selectDeveloperById = async (developerId: string) => {
  setProfileLoading(true);
  setCurrentView("profile");

  setSelectedDeveloper(null);
  setDeveloperDetails(null);
  setDeveloperReviews(null);
  setSelectedReviewPage(1);

  try {
    const details = await developerService.getDeveloperById(developerId);
    const reviews = await developerService.getReviews(developerId, 1);

    const mappedDeveloper = mapBackendDeveloperToFrontend(
      details,
      developerId
    );

    setSelectedDeveloper(mappedDeveloper);
    setDeveloperDetails(details);
    setDeveloperReviews(reviews);
  } finally {
    setProfileLoading(false);
  }
};

  const handleDeveloperSelect = (developer: DeveloperInfo) => {
  selectDeveloperById(developer.id);
};

  const handleAssignClick = () => {
    setCurrentView("assign");
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const formatDateWithEndOfDay = (date: Date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(23, 59, 59, 999);
    return adjustedDate.toISOString();
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

    if (dueDate && isDateInPast(dueDate)) {
      toast({
        title: "Invalid Due Date",
        description: "Due date cannot be in the past.",
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
        due_date: dueDate ? formatDateWithEndOfDay(dueDate) : undefined,
      };

      const res = await developerService.createTask(taskData);

      // Expect response to contain id
      if (res && (res.id || res.task_id || res._id)) {
        const id = (res.id || res.task_id || res._id) as string;
        setTaskId(id);
      }

      setCurrentView("success");
      setCountdown(5);
    } catch (error) {
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
    setSelectedDeveloper(null); // ✅ reset selected developer
    setDeveloperDetails(null);  // ✅ reset developer details
    setTaskTitle("");
    setTaskDescription("");
    setDueDate(undefined);
    setCurrentPage(1);
    setTaskId(null);
    onClose(); // ✅ call parent close handler
  };

  useEffect(() => {
    if (currentView === "success") {
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        handleClose();
        navigate("/inbox", {
          state: { task: taskId },
        });
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, taskId, navigate]);

  const renderStars = (rating: number | null | undefined) => {
    if (rating == null) return null;
    const r = Math.round(rating);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < r ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
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
                    {developer.image ? (
                      <AvatarImage src={developer.image} alt={developer.name} />
                    ) : (
                      <AvatarFallback>
                        {developer?.name
                          ? developer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : ""}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{developer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(developer.avg_rating)}
                      <span className="text-sm text-muted-foreground">
                        ({developer.avg_rating || 0}) • {developer.total_done} Projects
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {developer.bio || "Full-stack developer with experience building scalable web applications."}
                    </p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {(
                        developer.skills || [
                          "React",
                          "Node.js",
                          "MongoDB",
                          "AWS",
                        ]
                      ).map((skill: any) => (
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
                    <div className="font-semibold">${developer.hourpaid || 0}/hr</div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
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
            <span className="text-sm text-muted-foreground">Page {currentPage}</span>
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
    

if (profileLoading) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      Loading developer...
    </div>
  );
}

if (!selectedDeveloper || !developerDetails) {
  return null;
}



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
              {developerDetails.image ? (
                <AvatarImage
                  src={developerDetails.image}
                  alt={developerDetails.name}
                />
              ) : (
               <AvatarFallback className="text-xl">
  {(developerDetails?.name || developerDetails?.Name || selectedDeveloper.name)
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()}

</AvatarFallback>

             )}
            </Avatar>
            <div>
  <h2 className="text-2xl font-semibold">
  {developerDetails?.name || selectedDeveloper.name}
</h2>
  <div className="flex items-center gap-2 mt-1">
    {renderStars(developerDetails.rating)}
    <span className="text-sm text-muted-foreground">
      ({developerDetails.rating || 0}) •{" "}
      {developerDetails.task_complete || 0} Projects
    </span>
  </div>
</div>

          </div>
          <div className="ml-auto text-right">
            <div className="font-semibold text-lg">
              ${developerDetails.hour_paid || 0}/hr
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div
                className={`h-2 w-2 rounded-full ${
                  developerDetails.available ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {developerDetails.available ? "Available Now" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            {developerDetails.bio || "Full-stack developer with 6+ years..."}
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
              Reviews ({developerReviews?.total_review || 0})
            </h3>

            {reviewLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading reviews...
              </div>
            ) : developerReviews?.review?.length > 0 ? (
              <div className="space-y-3">
                {developerReviews.review.map((review: any, index: number) => (
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
                      {review.created_at
                        ? new Date(review.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Recent"}
                    </div>
                  </div>
                ))}

                {developerReviews?.HasMore && (
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleReviewViewMore(selectedReviewPage + 1)
                      }
                    >
                      Load More Reviews
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No reviews yet
              </div>
            )}
          </div>

          {/* <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowReviewDialog(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" /> Write a Review
            </Button>
          </div> */}
        </div>
      </div>
    );
  };

  const renderAssignForm = () => {
    if (!selectedDeveloper) return null;

    return (
      <div className="space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("profile")} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Assign to {selectedDeveloper.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taskTitle">Task Title *</Label>
            <Input id="taskTitle" placeholder="Enter Task Details" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
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
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    return d < today;
                  }}
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
            <span className="font-medium">Request sent to {selectedDeveloper.name}</span>
            <Avatar className="h-6 w-6 ml-2">
              <AvatarFallback className="text-xs">
                {selectedDeveloper.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Button onClick={() => navigate("/inbox", { state: { task: taskId } })}>Message</Button>
        <p className="text-sm text-muted-foreground">
          Redirecting in <span className="font-semibold">{countdown}</span> seconds...
        </p>
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
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
          {renderCurrentView()}
        </div>

        {(currentView === "profile" || currentView === "assign") && (
          <div className="border-t pt-4 mt-4 flex justify-between">
            <Button variant="outline" onClick={() => {
              setDeveloperDetails(null);
              setSelectedDeveloper(null);
              setDeveloperReviews(null);
              setCurrentView("list")
            }}>
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
          onReviewAdded={handleReviewAdded} // ✅
        />
      )}
    </Dialog>
  );
};

export default AssignToDeveloper;
