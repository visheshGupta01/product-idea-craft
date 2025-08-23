import apiClient from '@/lib/apiClient';

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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
  frontend_stack: string | null;
  backend_stack: string | null;
  database_stack: string | null;
  total_assigned_tasks: number;
  total_solved_bugs: number;
  created_at: string;
  last_login_at: string;
}

export const fetchProfile = async (): Promise<ProfileData> => {
  try {
    const response = await apiClient.get('/profile');
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