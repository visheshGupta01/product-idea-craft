import apiClient from '@/lib/apiClient';

export interface FeedbackSubmission {
  content: string;
  subject: string;
  category: string;
}

export interface FeedbackCategories {
  categories: string[];
}

export interface Feedback {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  user_id: string;
  name: string;
  content: string;
  subject: string;
  category: string;
}

export interface FeedbacksResponse {
  feedbacks: Feedback[];
}

export const submitFeedback = async (feedback: FeedbackSubmission): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/api/feedback', feedback);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const getFeedbackCategories = async (): Promise<FeedbackCategories> => {
  try {
    const response = await apiClient.get('/api/feedback/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback categories:', error);
    throw error;
  }
};

export const getAllFeedbacks = async (page: number = 1, category?: string): Promise<FeedbacksResponse> => {
  try {
    let url = `/api/feedbacks?page=${page}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};