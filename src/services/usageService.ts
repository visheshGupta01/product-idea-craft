import apiClient from '@/lib/apiClient';

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

export const fetchUsageData = async (month: string): Promise<UsageData> => {
  try {
    const response = await apiClient.get(`/usage?month=${month}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching usage data:', error);
    throw error;
  }
};
