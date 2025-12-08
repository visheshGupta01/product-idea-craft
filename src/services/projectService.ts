import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface ProjectFromAPI {
  session_id: string;
  title: string;
  project_url: string;
  screen_shot:string;
  deploy_url: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "ai";
  msg: string;
  session_id: string;
  created_at: string;
}

export interface ProjectDetails {
  success: boolean;
  response: ChatMessage[];
  project_url: string;
  github_url: string;
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
  title: string;
}

export const fetchProjects = async (
  page: number = 1
): Promise<
   ProjectFromAPI[]> => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PROJECT.LIST}?page=${page}`
    );

    if (response.data.success) {
      // Empty array is a valid response, not an error
      return Array.isArray(response.data.projects) ? response.data.projects : [];
    } else {
      throw new Error(response.data.message || "Failed to fetch projects");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};


export const fetchProjectDetails = async (
  sessionId: string
): Promise<ProjectDetails> => {
  try {
    //console.log('Fetching project details for sessionId:', sessionId);
    const response = await apiClient.get(
      `${API_ENDPOINTS.CHAT.SESSION_CONTENT}?session_id=${sessionId}`
    );
    //console.log('Fetched project details for sessionId:', sessionId, response.data);
    sessionStorage.setItem(
      `chat_session_${sessionId}`,
      JSON.stringify({
        sessionId,
        messages: response.data.response.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          msg: msg.msg,
          created_at: msg.created_at,
        })),
        projectUrl: response.data.project_url, // Use project_url for preview
        sitemap: response.data.sitemap, // Use sitemap for Vercel deployment
        title: response.data.title, // Use title for Vercel deployment
        githubUrl: response.data.github_url,
        vercelUrl: response.data.vercel_url, // Use github_url for Vercel deployment
      })
    );
    return response.data;
  } catch (error) {
    //console.error("Error fetching project details:", error);
    throw error;
  }
};

export const renameProject = async (
  sessionId: string,
  newTitle: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.PROJECT.RENAME, {
      session_id: sessionId,
      new_title: newTitle,
    });
    //console.log(response)
    //console.log('Renamed project:', response.data);
    return response.data;
  } catch (error) {
    //console.error("Error renaming project:", error);
    throw error;
  }
};
