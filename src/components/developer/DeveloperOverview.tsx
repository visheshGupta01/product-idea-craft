import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, Github, Linkedin, Edit } from 'lucide-react';
import { developerService, DeveloperProfile, TasksCount, DeveloperProfileResponse } from '@/services/developerService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  client: string;
  status: 'pending' | 'in_progress' | 'completed';
  assign_request: string;
  deadline: string;
}

// Mock data for demo purposes - replace with actual API calls
const mockTasks: Task[] = [
  {
    id: 1,
    title: "API Integration",
    description: "Integrate Payment Gateway APIs with the existing system",
    client: "Ecommerce Solutions",
    status: "pending",
    assign_request: "23/09/25",
    deadline: "30hrs left"
  },
  {
    id: 2,
    title: "API Integration", 
    description: "Integrate Payment Gateway APIs with the existing system",
    client: "Ecommerce Solutions",
    status: "pending",
    assign_request: "23/09/25",
    deadline: "30hrs left"
  },
  {
    id: 3,
    title: "API Integration",
    description: "Integrate Payment Gateway APIs with the existing system", 
    client: "Ecommerce Solutions",
    status: "pending",
    assign_request: "24/09/25",
    deadline: "30hrs left"
  }
];

const mockClientReviews = [
  {
    id: 1,
    description: "Great work on Integrate Payment Gateway APIs with the existing system",
    client: "XYZ INC.",
    rating: 4,
    date: "15/12/2025"
  },
  {
    id: 2,
    description: "Good optimization work. Database performance improved significantly.",
    client: "Database Optimization",
    rating: 4,
    date: "15/10/2025"
  }
];

export const DeveloperOverview: React.FC = () => {
  const [profileData, setProfileData] = useState<DeveloperProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'reviews'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'awaiting' | 'pending'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await developerService.getDeveloperProfile();
      setProfileData(response);
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
    if (!profileData?.tasks_count) return 0;
    return profileData.tasks_count.percentage || 0;
  };

  const getFilteredTasks = () => {
    if (!profileData) return [];
    
    if (taskFilter === 'all') {
      return [
        ...profileData.null_status_tasks,
        ...profileData.in_progress_tasks,
        ...profileData.todo_tasks
      ];
    }
    if (taskFilter === 'awaiting') return profileData.null_status_tasks;
    if (taskFilter === 'pending') return profileData.in_progress_tasks;
    return [];
  };

  const getTaskFilterCount = (filter: 'all' | 'awaiting' | 'pending') => {
    if (!profileData) return 0;
    
    if (filter === 'all') {
      return (profileData.null_status_tasks?.length || 0) + 
             (profileData.in_progress_tasks?.length || 0) + 
             (profileData.todo_tasks?.length || 0);
    }
    if (filter === 'awaiting') return profileData.null_status_tasks?.length || 0;
    if (filter === 'pending') return profileData.in_progress_tasks?.length || 0;
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

  const { developer_info: profile, tasks_count: stats } = profileData;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-6">
        {/* Left Sidebar - Profile */}
        <Card className="w-80 bg-black">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="" alt={profile.first_name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <Badge variant="secondary" className="mb-2">
                  Availability
                </Badge>
                <div className="text-right">
                  <span className="text-2xl font-bold">{profile.rating || 5}</span>
                  <span className="text-sm text-muted-foreground ml-1">Hourly rate</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-1">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{profile.email}</p>
              
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {profile.bio || "Passionate about technology and innovation. Experienced in full-stack development and database optimization."}
              </p>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  Skills
                  <div className="flex ml-2">
                    {renderStars(profile.rating || 4)}
                  </div>
                </h3>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="bg-pink-500 text-white text-xs">React</Badge>
                  <Badge variant="secondary" className="bg-pink-500 text-white text-xs">Node.js</Badge>
                  <Badge variant="secondary" className="bg-pink-500 text-white text-xs">MongoDB</Badge>
                  <Badge variant="secondary" className="bg-pink-500 text-white text-xs">AWS</Badge>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">On Web</h3>
                <div className="space-y-2">
                  {profile.github_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="w-4 h-4" />
                      <span className="truncate">{profile.github_url.replace('https://github.com/', '')}</span>
                    </div>
                  )}
                  {profile.linkedin_url && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="w-4 h-4" />
                      <span className="truncate">{profile.linkedin_url.replace('https://linkedin.com/in/', '')}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-800">
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
              onClick={() => setActiveTab('tasks')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tasks'
                  ? 'border-black text-black'
                  : 'border-transparent text-muted-foreground hover:text-black'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-muted-foreground hover:text-black'
              }`}
            >
              Client Reviews
            </button>
          </div>

          {activeTab === 'tasks' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
                    <div className="text-2xl font-bold mb-2">{calculateProgress()}%</div>
                    <Progress value={calculateProgress()} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {stats.done} of {stats.total} tasks completed
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Requests</h3>
                    <div className="text-2xl font-bold mb-1">{stats.todo}</div>
                    <p className="text-xs text-muted-foreground">Awaiting your response</p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Tasks</h3>
                    <div className="text-2xl font-bold mb-1">{stats.in_progress}</div>
                    <p className="text-xs text-muted-foreground">To be completed</p>
                  </CardContent>
                </Card>

                <Card className="bg-black">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed</h3>
                    <div className="text-2xl font-bold mb-1">{stats.done}</div>
                    <p className="text-xs text-muted-foreground">Completed tasks</p>
                  </CardContent>
                </Card>
              </div>

              {/* New Task Assignment */}
              <Card className="bg-black">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">New Task Assignment</h3>
                  <p className="text-sm text-muted-foreground mb-4">You have {profileData.null_status_tasks?.length || 0} task(s) pending your acceptance</p>
                  
                  <div className="space-y-3">
                    {profileData.null_status_tasks?.slice(0, 3).map((task) => (
                      <Card key={task.ID} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white px-4">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" className="px-4">
                                Decline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setTaskFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === 'all'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All {getTaskFilterCount('all')}
                    </button>
                    <button
                      onClick={() => setTaskFilter('awaiting')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === 'awaiting'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Awaiting {getTaskFilterCount('awaiting')}
                    </button>
                    <button
                      onClick={() => setTaskFilter('pending')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        taskFilter === 'pending'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Pending {getTaskFilterCount('pending')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {getFilteredTasks().map((task) => (
                      <Card key={task.ID} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{task.title}</h4>
                              <p className="text-sm mb-2">{task.description}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {task.status === 'todo' && (
                                <>
                                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                                    Start Working
                                  </Button>
                                  <Badge variant="secondary" className="text-red-500">
                                    Pending
                                  </Badge>
                                </>
                              )}
                              {task.status === 'in_progress' && (
                                <>
                                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                                    Mark Complete
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Message
                                  </Button>
                                </>
                              )}
                              {task.status === 'done' && (
                                <Badge variant="default" className="bg-green-500">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'reviews' && (
            <Card className="bg-black">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Client Reviews</h3>
                <p className="text-sm text-muted-foreground mb-4">Feedback from your client</p>
                
                <div className="space-y-4">
                  {mockClientReviews.map((review) => (
                    <Card key={review.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm mb-2">{review.description}</p>
                        <p className="text-sm text-muted-foreground">Client: {review.client}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};