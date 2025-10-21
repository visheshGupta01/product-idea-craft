import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface ShareChatResponse {
  success: boolean;
  response: Array<{
    id: number;
    role: "user" | "ai";
    msg: string;
    session_id: string;
    created_at: string;
  }>;
  project_url: string;
  sitemap: {
    project_name: string;
    project_type: string;
    domain: string;
    description: string;
    tech_stack: {
      frontend: string;
      backend: string;
      database: string;
    };
    pages: any;
    database_models: any;
    backend_api_routes: any;
    source_code_paths: {
      frontend: string;
      backend: string;
      models: string;
      api_routes: string;
      database_config: string;
    };
  };
  vercel_url: string;
  github_url: string;
  title: string;
}

export const fetchSharedChat = async (
  chatId: string
): Promise<ShareChatResponse> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SHARE.CHAT}?chat=${chatId}`
    );
    //console.log(response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching shared chat:", error);
    throw error;
  }
};
