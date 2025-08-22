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
  const token = localStorage.getItem("auth_token"); // or sessionStorage / context
  console.log(token)
  const response = await fetch("http://localhost:8000/admin/dashboard", {
    headers: {
      "Authorization": `Bearer ${token}`, // adjust if backend uses custom header
      "Content-Type": "application/json"
    },
    // credentials: "include", // if using cookies
  });
console.log(response)
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }
const data = await response.json();
  console.log(data)
  return data
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
const token = localStorage.getItem("auth_token"); // or sessionStorage / context
  console.log(token)
  const response = await fetch("http://localhost:8000/admin/users", {
    headers: {
      "Authorization": `Bearer ${token}`, // adjust if backend uses custom header
      "Content-Type": "application/json"
    },
    // credentials: "include", // if using cookies
  });  

  if (!response.ok) {
    throw new Error('Failed to fetch users data');
  }
const data = await response.json();
console.log(data);
return data;
};