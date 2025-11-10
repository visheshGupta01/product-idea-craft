import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface InboxTask {
  id: number;
  title: string;
  description: string;
  session_id: string;
  assignee_id: string;
  assigner_id: string;
  status: string;
  share_chat: string;
  chat_mode: boolean;
  due_date: string | null;
  created_at: string;
  assigner_name: string;
  assignee_name: string;
  assigner_unread_count: number;
  assignee_unread_count: number;
}

export interface InboxResponse {
  Role: string;
  tasks: InboxTask[];
  total: number;
  page: number;
  page_size: number;
}

export interface ChatMessage {
  id: number;
  task_id: number;
  role: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

class InboxService {
  async getUserInbox(page: number = 1): Promise<InboxResponse> {
    const response = await apiClient.get(`${API_ENDPOINTS.USER.INBOX}?page=${page}`);
    return response.data;
  }

  async getDeveloperInbox(page: number = 1): Promise<InboxResponse> {
    const response = await apiClient.get(`${API_ENDPOINTS.DEVELOPER.INBOX}?page=${page}`);
    return response.data;
  }

  async getChatMessages(taskId: number): Promise<ChatMessage[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.CHAT.READ}?task_id=${taskId}`);
    return response.data;
  }
}

export const inboxService = new InboxService();
