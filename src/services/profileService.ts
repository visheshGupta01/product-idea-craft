import apiClient from '@/lib/apiClient';

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  created_at: string;
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
  country: string;
  city: string;
  github_url: string;
  linkedin_url: string;
  total_solved_tasks: number;
  total_pending_task: number;
  company_name: string;
  experience: string;
  skills: string[] | null;
  bio: string;
  hourpaid: number;
}

export const fetchProfile = async (): Promise<ProfileData> => {
  try {
    const response = await apiClient.get('/api/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
};

export const updateProfile = async (profileData: Partial<ProfileData>): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.put('/profile', profileData);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Failed to update profile' };
  }
};