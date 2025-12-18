import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface DashboardData {
  success: boolean;
  yearly_stats: Array<{
    year: number;
    months: Array<{
      month: string;
      total_verified: number;
      total_verified_pro: number;
      days: Array<{
        date: string;
        total_verified: number;
        total_verified_pro: number;
      }>;
      weeks: Array<{
        week_number: number;
        days: Array<{
          date: string;
          total_verified: number;
          total_verified_pro: number;
        }>;
      }>;
    }>;
  }>;
  country_percentages: Array<{
    country: string;
    user_count: number;
    percentage: number;
  }>;
  country_geo_data: Array<{
    country: string;
    lat: number;
    lon: number;
  }>;
  conversion_rate_percent: number;
  user_growth_rate_percent: number;
  dropping_rate_percent: number;
  revenue_data: {
    total_revenue: number;
    pro_revenue: number;
    team_revenue: number;
  };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_login_at: string;
  no_of_projects: number;
  plan_name?: string;
}

export interface UsersData {
  total_verified_users: number;
  users: User[];
}

export const fetchUsersData = async (page: number = 1): Promise<UsersData> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.USERS}?page=${page}`
    );
    //console.log(response.data);
    if (response.data.success) {
      return {
        total_verified_users: response.data.total_verified_users,
        users: response.data.users,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch users data");
    }
  } catch (error) {
    //console.error("Error fetching users data:", error);
    throw error;
  }
};

export const cancelUserSubscription = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post("/api/payment/cancel-plan", {
      id: userId,
    });
    return response.data;
  } catch (error) {
    //console.error("Error canceling subscription:", error);
    throw error;
  }
};

export interface Developer {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  created_at: string;
  last_login_at: string;
  user_type: string;
  github_url?: string;
  rating_count: number;
  average_rating: number;
  hour_paid: number;
  bio?: string;
  skills?: string;
  experience?: number;
  total_in_progress_task: number;
  company_name?: string;
  total_pending_task: number;
  linked_in_url?: string;
  total_solved_tasks: number;
}

export interface DevelopersData {
  total_developers: number;
  developers: Developer[];
}

export const fetchDevelopersData = async (page: number = 1): Promise<DevelopersData> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.DEVELOPERS}?page=${page}`
    );
    if (response.data.success) {
      return {
        total_developers: response.data.total_developers,
        developers: response.data.developers,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch developers data");
    }
  } catch (error) {
    throw error;
  }
};

export interface Admin {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  plan_name?: string;
  plan_id?: string;
  credits: number;
  user_type: string;
  created_at: string;
  last_login_at: string;
}

export interface AdminsData {
  total_admins: number;
  admins: Admin[];
}

export const fetchAdminsData = async (page: number = 1): Promise<AdminsData> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.ADMINS}?page=${page}`
    );
    if (response.data.success) {
      return {
        total_admins: response.data.total_admins,
        admins: response.data.admins,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch admins data");
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserCredits = async (
  userId: string,
  credits: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.UPDATE_CREDITS, {
      id: userId,
      credits: credits,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.CREATE_ADMIN, {
      email: email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
