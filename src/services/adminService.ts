import { authService } from './authService';

export interface DashboardData {
  success: boolean;
  yearlyStats: Array<{
    year: number;
    months: Array<{
      month: string;
      totalVerified: number;
      totalVerifiedPro: number;
      days: Array<{
        date: string;
        totalVerified: number;
        totalVerifiedPro: number;
      }>;
      weeks: Array<{
        weekNumber: number;
        days: Array<{
          date: string;
          totalVerified: number;
          totalVerifiedPro: number;
        }>;
      }>;
    }>;
  }>;
  countryPercentages: Array<{
    country: string;
    userCount: number;
    percentage: number;
  }>;
  countryGeoData: Array<{
    country: string;
    latitude: number;
    longitude: number;
  }>;
  conversionRate: number;
  userGrowthRate: number;
  droppingRate: number;
  revenueData: {
    totalRevenue: number;
    proRevenue: number;
    teamRevenue: number;
  };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = authService.getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  const response = await fetch('http://localhost:8080/admin/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access. Please log in as an admin.');
    }
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
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
  const token = authService.getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  const response = await fetch('http://localhost:8080/admin/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access. Please log in as an admin.');
    }
    throw new Error('Failed to fetch users data');
  }

  return response.json();
};