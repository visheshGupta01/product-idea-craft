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