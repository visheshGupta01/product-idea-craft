import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, Github, Linkedin, Edit, Loader2 } from 'lucide-react';
import { developerService, DeveloperInfo, DeveloperProfileResponse, Review } from '@/services/developerService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

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

export const DeveloperOverview: React.FC = () => {
  const [profileData, setProfileData] = useState<DeveloperProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'reviews'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'awaiting' | 'pending' | 'done' | 'in_progress' | 'todo' | 'not_accepted'>('all');
  const [isAvailable, setIsAvailable] = useState(true);
  const [updatingTasks, setUpdatingTasks] = useState<Set<number>>(new Set());
  const [additionalTasks, setAdditionalTasks] = useState<Task[]>([]);
  const [taskPage, setTaskPage] = useState(1);
  const [hasMoreTasks, setHasMoreTasks] = useState(false);
  const [loadingMoreTasks, setLoadingMoreTasks] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAllNewTasks, setShowAllNewTasks] = useState(false);
  const [showAllMyTasks, setShowAllMyTasks] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews' && profileData) {
      loadReviews();
    }
  }, [activeTab, profileData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await developerService.getDeveloperProfile();
      console.log(response);
      setProfileData(response);
      setIsAvailable(response.developer_info.status || false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: number) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      console.log('Accepting task', taskId);
      await developerService.updateTaskStatus(taskId, 'todo');
      toast({
        title: "Success",
        description: "Task accepted successfully",
      });
      loadProfile(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept task",
        variant: "destructive"
      });
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleDenyTask = async (taskId: number) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      await developerService.denyTask(taskId);
      toast({
        title: "Success",
        description: "Task declined successfully",
      });
      loadProfile(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline task",
        variant: "destructive"
      });
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      await developerService.updateDeveloperStatus();
      setIsAvailable(!isAvailable);
      toast({
        title: "Success",
        description: `Availability updated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const handleStartWorking = async (taskId: number) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      console.log('Starting work on task', taskId);
      await developerService.updateTaskStatus(taskId, 'in_progress');
      toast({
        title: "Success",
        description: "Task started successfully",
      });
      loadProfile(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleMarkCompleted = async (taskId: number) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      console.log('Completing task', taskId);
      await developerService.updateTaskStatus(taskId, 'done');
      toast({
        title: "Success",
        description: "Task completed successfully",
      });
      loadProfile(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const calculateProgress = () => {
    if (!profileData?.developer_info) return 0;
    const { total_tasks, total_done } = profileData.developer_info;
    return total_tasks > 0 ? Math.round((total_done / total_tasks) * 100) : 0;
  };

  const loadReviews = async () => {
    if (!profileData?.developer_info?.id) return;
    
    try {
      setLoadingReviews(true);
      const response = await developerService.getReviews(profileData.developer_info.id, reviewPage);
      if (reviewPage === 1) {
        setReviews(response.reviews || []);
      } else {
        setReviews(prev => [...prev, ...(response.reviews || [])]);
      }
      setHasMoreReviews(reviewPage < (response.total_pages || 0));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadMoreTasks = async () => {
    if (!profileData?.developer_info?.id || loadingMoreTasks) return;
    
    try {
      setLoadingMoreTasks(true);
      const nextPage = taskPage + 1;
      const status = taskFilter === 'all' ? undefined : taskFilter;
      const response = await developerService.getDeveloperTasks(nextPage, status);
      
      setAdditionalTasks(prev => [...prev, ...(response.tasks || [])]);
      setTaskPage(nextPage);
      setHasMoreTasks(nextPage < (response.total_pages || 0));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more tasks",
        variant: "destructive"
      });
    } finally {
      setLoadingMoreTasks(false);
    }
  };

  const loadMoreReviews = async () => {
    setReviewPage(prev => prev + 1);
  };

  useEffect(() => {
    if (reviewPage > 1) {
      loadReviews();
    }
  }, [reviewPage]);

  const getFilteredTasks = () => {
    if (!profileData) return [];
    
    const baseTasks = taskFilter === 'all' 
      ? [...profileData.null_status_tasks, ...profileData.active_tasks]
      : taskFilter === 'awaiting' 
        ? profileData.null_status_tasks
        : taskFilter === 'pending'
          ? profileData.active_tasks
          : [];
    
    return [...baseTasks, ...additionalTasks];
  };

  const getTaskFilterCount = (filter: 'all' | 'awaiting' | 'pending') => {
    if (!profileData) return 0;
    
    if (filter === 'all') {
      return (profileData.null_status_tasks?.length || 0) + 
             (profileData.active_tasks?.length || 0);
    }
    if (filter === 'awaiting') return profileData.null_status_tasks?.length || 0;
    if (filter === 'pending') return profileData.active_tasks?.length || 0;
    return 0;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex gap-6">
          <Skeleton className="w-80 h-96" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-32" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Unable to load profile data</p>
      </div>
    );
  }

  const { developer_info: profile } = profileData;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-6">
        {/* Left Sidebar - Profile */}
        <Card className="w-80 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto bg-black">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="" alt={profile.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Availability</Badge>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityToggle}
                  />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">
                    ${profile.hourpaid || 50}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    Hourly rate
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-1">
                {profile.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {profile.email}
              </p>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {profile.bio ||
                  "Passionate about technology and innovation. Experienced in full-stack development and database optimization."}
              </p>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  Skills
                  <div className="flex ml-2">
                    {renderStars(profile.avg_rating || 0)}
                  </div>
                </h3>
                <div className="flex flex-wrap gap-1">
                  {(profile.skills || ['React', 'Node.js', 'MongoDB', 'AWS']).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-pink-500 text-white text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">On Web</h3>
                <div className="space-y-2">
                  {profile.github_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="w-4 h-4" />
                      <span className="truncate">
                        {profile.github_url.replace("https://github.com/", "")}
                      </span>
                    </div>
                  )}
                  {profile.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="w-4 h-4" />
                      <span className="truncate">
                        {profile.linkedin_url.replace(
                          "https://linkedin.com/in/",
                          ""
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() => navigate("/developer-dashboard/profile")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-6 border-b">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "tasks"
                  ? "border-black text-black"
                  : "border-transparent text-muted-foreground hover:text-black"
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-black text-black"
                  : "border-transparent text-muted-foreground hover:text-black"
              }`}
            >
              Client Reviews
            </button>
          </div>

          {activeTab === "tasks" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Progress
                    </h3>
                    <div className="text-2xl font-bold mb-2">
                      {calculateProgress()}%
                    </div>
                    <Progress
                      value={calculateProgress()}
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {profile.total_done} of {profile.total_tasks} tasks completed
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Requests
                    </h3>
                    <div className="text-2xl font-bold mb-1">{profile.total_pending}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting your response
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Pending Tasks
                    </h3>
                    <div className="text-2xl font-bold mb-1">
                      {profile.total_in_progress}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To be completed
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Completed
                    </h3>
                    <div className="text-2xl font-bold mb-1">{profile.total_done}</div>
                    <p className="text-xs text-muted-foreground">
                      Completed tasks
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* New Task Assignment */}
              <Card className="bg-black">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    New Task Assignment
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have {profileData.null_status_tasks?.length || 0}{" "}
                    {profileData.null_status_tasks?.length === 1
                      ? "task"
                      : "tasks"}{" "}
                    pending your acceptance
                  </p>

                  <div className="space-y-3">
                    {(showAllNewTasks 
                      ? profileData.null_status_tasks 
                      : profileData.null_status_tasks?.slice(0, 3)
                    )?.map((task) => (
                      <Card key={task.ID} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {task.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due:{" "}
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No deadline"}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4"
                                onClick={() => handleAcceptTask(task.ID)}
                                disabled={updatingTasks.has(task.ID)}
                              >
                                {updatingTasks.has(task.ID)
                                  ? "Accepting..."
                                  : "Accept"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-4"
                                onClick={() => handleDenyTask(task.ID)}
                                disabled={updatingTasks.has(task.ID)}
                              >
                                {updatingTasks.has(task.ID)
                                  ? "Declining..."
                                  : "Decline"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {!showAllNewTasks && (profileData.null_status_tasks?.length || 0) > 3 && (
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => navigate('/developer-dashboard/tasks')}
                          variant="outline"
                          className="w-full"
                        >
                          Show More ({(profileData.null_status_tasks?.length || 0) - 3} more)
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* My Tasks */}
              <Card className="bg-black">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">My Tasks</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search Projects"
                        className="px-3 py-1 text-sm border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 flex-wrap">
                    <button
                      onClick={() => {
                        setTaskFilter("all");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "all"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All {getTaskFilterCount("all")}
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("awaiting");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "awaiting"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Awaiting {getTaskFilterCount("awaiting")}
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("pending");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "pending"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Pending {getTaskFilterCount("pending")}
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("done");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "done"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("in_progress");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "in_progress"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("todo");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "todo"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      To Do
                    </button>
                    <button
                      onClick={() => {
                        setTaskFilter("not_accepted");
                        setAdditionalTasks([]);
                        setTaskPage(1);
                        setShowAllMyTasks(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === "not_accepted"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Not Accepted
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(showAllMyTasks 
                      ? getFilteredTasks() 
                      : getFilteredTasks().slice(0, 3)
                    ).map((task) => (
                      <Card key={task.ID} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{task.title}</h4>
                              <p className="text-sm mb-2">{task.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Due:{" "}
                                {task.due_date
                                  ? new Date(task.due_date).toLocaleDateString()
                                  : "No deadline"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {task.status === "todo" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-black text-white hover:bg-gray-800"
                                    onClick={() => handleStartWorking(task.ID)}
                                    disabled={updatingTasks.has(task.ID)}
                                  >
                                    {updatingTasks.has(task.ID)
                                      ? "Starting..."
                                      : "Start Working"}
                                  </Button>
                                  <Badge
                                    variant="secondary"
                                    className="text-red-500"
                                  >
                                    Pending
                                  </Badge>
                                </>
                              )}
                              {task.status === "in_progress" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-black text-white hover:bg-gray-800"
                                    onClick={() => handleMarkCompleted(task.ID)}
                                    disabled={updatingTasks.has(task.ID)}
                                  >
                                    {updatingTasks.has(task.ID)
                                      ? "Completing..."
                                      : "Mark Complete"}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Message
                                  </Button>
                                </>
                              )}
                              {task.status === "done" && (
                                <Badge
                                  variant="default"
                                  className="bg-green-500"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {!showAllMyTasks && getFilteredTasks().length > 3 && (
                      <div className="flex justify-center pt-2">
                        <Button
                          onClick={() => navigate('/developer-dashboard/tasks')}
                          variant="outline"
                          className="w-full"
                        >
                          Show More ({getFilteredTasks().length - 3} more)
                        </Button>
                      </div>
                    )}
                    
                    {(taskFilter !== 'awaiting' && taskFilter !== 'pending') && hasMoreTasks && (
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={loadMoreTasks}
                          disabled={loadingMoreTasks}
                          variant="outline"
                          className="w-full max-w-xs"
                        >
                          {loadingMoreTasks ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            'Load More Tasks'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "reviews" && (
            <Card className="bg-black">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Client Reviews</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Feedback from your clients
                </p>

                {loadingReviews && reviews.length === 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="border">
                        <CardContent className="p-4">
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{review.comment}</p>
                          <p className="text-sm text-muted-foreground">
                            Client: {review.reviewer_name}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {hasMoreReviews && (
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={loadMoreReviews}
                          disabled={loadingReviews}
                          variant="outline"
                          className="w-full max-w-xs"
                        >
                          {loadingReviews ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            'Load More Reviews'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};