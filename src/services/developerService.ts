import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface DeveloperInfo {
  id: string;
  name: string;
  skills: string[];
  linkedin_url: string;
  github_url: string;
  hourpaid: number;
  status: boolean;
  total_tasks: number;
  total_in_progress: number;
  total_pending: number;
  total_done: number;
  bio: string;
  experience: string;
  avg_rating: number;
  rating_count: number;
  email: string;
}

export interface DeveloperProfileResponse {
  active_tasks: Task[];
  developer_info: DeveloperInfo;
  null_status_tasks: Task[];
}

interface Task {
  id: number;
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

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface UpdateProfileData {
  github_url?: string;
  linkedin_url?: string;
  skills?: string[];
  company_name?: string;
  experience?: string;
  bio?: string;
  hourpaid?: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  session_id: string;
  assignee_id: string;
  due_date?: string;
}

export interface CreateTaskResponse {
  status: "success";
  data: {
    Title: string;
    Description: string;
    SessionId: string;
    AssigneeID: string;
    AssignerID: string;
    DueDate?: string;
    ShareChat: string;
    AssignerName: string;
    AssigneeName: string;
  };
}

export interface CreateDeveloperData {
  first_name: string;
  last_name: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  skills: string[];
  company_name: string;
  experience: string;
  bio: string;
  hourpaid: number;
}

export interface CreateDeveloperResponse {
  status: "success";
  data: {
    message: string;
    developer_id: string;
  };
}

export interface Review {
  id: number;
  developer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

class DeveloperService {
  async getDeveloperProfile(): Promise<DeveloperProfileResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DEVELOPER.PROFILE);
      return response.data;
    } catch (error) {
      //console.error('Error fetching developer profile:', error);
      throw error;
    }
  }

  async updateDeveloperProfile(
    data: UpdateProfileData
  ): Promise<{ status: "success"; data: DeveloperInfo }> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.DEVELOPER.PROFILE,
        data
      );
      return response.data;
    } catch (error) {
      //console.error('Error updating developer profile:', error);
      throw error;
    }
  }

  async getDeveloperTasks(
    page: number = 1,
    status?: string
  ): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (status && status !== "") {
        params.append("status", status);
      }
      const response = await apiClient.get(
        `${API_ENDPOINTS.TASK.GET_TASKS}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      //console.error('Error fetching developer tasks:', error);
      throw error;
    }
  }

  async updateTaskStatus(
    taskId: number,
    status: "todo" | "in_progress" | "done"
  ): Promise<{ status: "success"; data: Task }> {
    try {
      const response = await apiClient.patch(
        `/api/update/status?task_id=${taskId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      //console.error('Error updating task status:', error);
      throw error;
    }
  }

  async denyTask(taskId: number): Promise<{ status: "success" }> {
    try {
      const response = await apiClient.delete(
        `/api/tasks/deny?task_id=${taskId}`
      );
      return response.data;
    } catch (error) {
      //console.error('Error denying task:', error);
      throw error;
    }
  }

  async updateDeveloperStatus(): Promise<{ status: "success" }> {
    try {
      const response = await apiClient.get("/api/developer/status");
      return response.data;
    } catch (error) {
      //console.error('Error updating developer status:', error);
      throw error;
    }
  }

  async getAllDevelopers(
    page: number = 1
  ): Promise<{ status: "success"; data: DeveloperInfo[] }> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.DEVELOPER.LIST}?page=${page}`
      );
      return response.data;
    } catch (error) {
      //console.error('Error fetching all developers:', error);
      throw error;
    }
  }

  async getDeveloperById(developerId: string): Promise<{
    Name: string;
    Rating: number;
    RatingCount: number;
    TaskComplete: number;
    HourPaid: number;
    Available: boolean;
    Skills: string[];
    Bio: string;
    Experience: string;
    Reviews: any[];
  }> {
    try {
      const response = await apiClient.get(
        `/api/developer?dev_id=${developerId}`
      );
      return response.data;
    } catch (error) {
      //console.error('Error fetching developer by ID:', error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskData): Promise<CreateTaskResponse> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.TASK.CREATE,
        taskData
      );
      return response.data;
    } catch (error) {
      //console.error('Error creating task:', error);
      throw error;
    }
  }

  async createDeveloper(
    developerData: CreateDeveloperData
  ): Promise<CreateDeveloperResponse> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.DEVELOPER.CREATE,
        developerData
      );
      return response.data;
    } catch (error) {
      //console.error('Error creating developer:', error);
      throw error;
    }
  }

  async getReviews(
    developerId: string,
    page: number = 1
  ): Promise<ReviewsResponse> {
    try {
      const res = await apiClient.get(`/api/reviews?dev_id=${developerId}&page=${page}`);

    const array = Array.isArray(res.data) ? res.data : [];

    // Convert raw backend review array → your Review type
    const formatted = array.map((r: any) => ({
      id: r.ID,
      developer_id: r.developer_id,
      reviewer_name: r.reviewer_name,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
    }));

    return {
      reviews: formatted,
      total: formatted.length,
      page,
      per_page: formatted.length,
      total_pages: 1, // backend doesn’t paginate
    };
    } catch (error) {
      //console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async submitReview(reviewData: {
    developer_id: string;
    reviewer_name: string;
    rating: number;
    comment: string;
  }): Promise<{ status: "success" }> {
    try {
      const response = await apiClient.post("/api/submit/review", reviewData);
      return response.data;
    } catch (error) {
      //console.error('Error submitting review:', error);
      throw error;
    }
  }
}

export const developerService = new DeveloperService();
