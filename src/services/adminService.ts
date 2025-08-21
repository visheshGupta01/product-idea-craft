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
  const response = await fetch('http://localhost:8080/admin/dashboard');
  
  if (!response.ok) {
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
  const response = await fetch('http://localhost:8080/admin/users');
  
  if (!response.ok) {
    throw new Error('Failed to fetch users data');
  }
  
  return response.json();
};