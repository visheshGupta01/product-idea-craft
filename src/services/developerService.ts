import { authService } from './authService';

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

class DeveloperService {
  private baseURL = '/api';

  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getDeveloperProfile(): Promise<DeveloperProfileResponse> {
    const response = await fetch(`${this.baseURL}/developer/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch developer profile: ${response.statusText}`);
    }

    return response.json();
  }

  async updateDeveloperProfile(data: UpdateProfileData): Promise<{ status: 'success'; data: DeveloperProfile }> {
    const response = await fetch(`${this.baseURL}/developer/profile`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update developer profile: ${response.statusText}`);
    }

    return response.json();
  }

  async getDeveloperTasks(page: number = 1): Promise<TasksResponse> {
    const response = await fetch(`${this.baseURL}/developer/tasks?page=${page}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch developer tasks: ${response.statusText}`);
    }

    return response.json();
  }

  async updateTaskStatus(taskId: number, status: 'todo' | 'in_progress' | 'done'): Promise<{ status: 'success'; data: Task }> {
    const response = await fetch(`${this.baseURL}/task/status?task_id=${taskId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task status: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllDevelopers(page: number = 1): Promise<{ status: 'success'; data: DeveloperProfile[] }> {
    const response = await fetch(`${this.baseURL}/developers?page=${page}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch developers: ${response.statusText}`);
    }

    return response.json();
  }
}

export const developerService = new DeveloperService();