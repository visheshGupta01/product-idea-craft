import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface ProfileData {
  plan_name: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  verified: boolean;
  token: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  user_type: string;
  plan_id: number;
  price: {
    id: number;
    name: string;
    price: number;
    is_default: boolean;
  };
  plan_started_at: string | null;
  plan_expires_at: string | null;
  is_plan_active: boolean;
  balances: number;
  rating?: number;
  reset_token: string;
  reset_token_expiry: string | null;
  github_access_token?: string;
  vercel_access_token?: string;
  created_at: string;
  last_login_at: string;
  github_url: string;
  linkedin_url: string;
  total_solved_tasks: number;
  total_pending_task: number;
  total_in_progress_task: number;
  company_name: string;
  experience: string;
  skills: string[] | null;
  bio: string;
  hourpaid: number;
  avg_rating: number;
  rating_count: number;
  status: boolean;
  credits: number;
}

export const fetchProfile = async (): Promise<ProfileData> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    //console.log('Profile data fetched:', response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching profile data:", error);
    throw error;
  }
};

export const updateProfile = async (
  profileData: Partial<ProfileData>
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.PROFILE.UPDATE,
      profileData
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    //console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
};
