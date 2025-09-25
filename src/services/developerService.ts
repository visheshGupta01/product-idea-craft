import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

export interface DeveloperProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  user_type: 'developer';
  plan_id: number;
  is_plan_active: boolean;
  balances: number;
  rating: number;
  github_url?: string;
  linkedin_url?: string;
  total_solved_tasks: number;
  total_pending_task: number;
  company_name?: string;
  experience?: string;
  bio?: string;
  hourpaid?: number;
  flag: boolean;
  created_at: string;
  last_login_at: string;
}

export interface DeveloperStats {
  total_tasks: number;
  total_pending: number;
  total_complete: number;
}

export interface DeveloperProfileResponse {
  status: 'success';
  data: DeveloperStats & {
    developer_info: DeveloperProfile;
  };
}

export interface Task {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  title: string;
  description: string;
  session_id: string;
  assignee_id: string;
  assigner_id: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
}

export interface TasksResponse {
  status: 'success';
  data: Task[];
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
  status: 'success';
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

class DeveloperService {
  async getDeveloperProfile(): Promise<DeveloperProfileResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DEVELOPER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching developer profile:', error);
      throw error;
    }
  }

  async updateDeveloperProfile(data: UpdateProfileData): Promise<{ status: 'success'; data: DeveloperProfile }> {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.DEVELOPER.PROFILE, data);
      return response.data;
    } catch (error) {
      console.error('Error updating developer profile:', error);
      throw error;
    }
  }

  async getDeveloperTasks(page: number = 1): Promise<TasksResponse> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DEVELOPER.TASKS}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching developer tasks:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: number, status: 'todo' | 'in_progress' | 'done'): Promise<{ status: 'success'; data: Task }> {
    try {
      const response = await apiClient.patch(`${API_ENDPOINTS.DEVELOPER.TASK_STATUS}?task_id=${taskId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  async getAllDevelopers(page: number = 1): Promise<{ status: 'success'; data: DeveloperProfile[] }> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DEVELOPER.LIST}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all developers:', error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskData): Promise<CreateTaskResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TASK.CREATE, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }
}

export const developerService = new DeveloperService();