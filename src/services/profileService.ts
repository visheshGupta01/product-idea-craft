import apiClient from '@/lib/apiClient';

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  created_at: string;
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