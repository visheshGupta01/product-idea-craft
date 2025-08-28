import apiClient from '@/lib/apiClient';

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
    const response = await apiClient.get('/admin/dashboard');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
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
}

export interface UsersData {
  total_verified_users: number;
  users: User[];
}

export const fetchUsersData = async (): Promise<UsersData> => {
  try {
    const response = await apiClient.get('/admin/users');
    console.log(response.data);
    if (response.data.success) {
      return {
        total_verified_users: response.data.total_verified_users,
        users: response.data.users
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch users data');
    }
  } catch (error) {
    console.error('Error fetching users data:', error);
    throw error;
  }
};

export const cancelUserSubscription = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/cancel-plan', { id: userId });
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};