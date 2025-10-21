import apiClient from "@/lib/apiClient";

export interface DailyUsage {
  created_at: string;
  token: number;
  credits_deducted: number;
}

export interface UsageData {
  daily_usage: DailyUsage[];
  total_tokens: number;
  total_credits: number;
  avg_tokens_per_day: number;
  avg_credits_per_day: number;
  active_days: number;
}

export const fetchUsageData = async (
  month: string
): Promise<UsageData | null> => {
  try {
    const response = await apiClient.get(`/api/usage?month=${month}`);
    //console.log(response.data[0]);
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      return null;
    }
    return response.data[0];
  } catch (error: any) {
    //console.error("Error fetching usage data:", error);

    // Provide more specific error messages
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("Usage data not found for this month");
      } else if (status === 401) {
        throw new Error("Authentication required");
      } else if (status === 500) {
        throw new Error("Server error. Please try again later");
      }
    } else if (error.request) {
      throw new Error("Network error. Please check your connection");
    }

    throw error;
  }
};
