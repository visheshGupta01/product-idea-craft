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