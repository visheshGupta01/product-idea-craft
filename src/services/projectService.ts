import apiClient from '@/lib/apiClient';

export interface ProjectFromAPI {
  session_id: string;
  title: string;
  project_url: string;
  deploy_url: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
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

export const fetchProjects = async (): Promise<ProjectFromAPI[]> => {
  try {
    const response = await apiClient.get('/projects');
    if (response.data.success) {
      return response.data.projects;
    } else {
      throw new Error(response.data.message || 'Failed to fetch projects');
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const fetchProjectDetails = async (sessionId: string): Promise<ProjectDetails> => {
  try {
    console.log('Fetching project details for sessionId:', sessionId);
    const response = await apiClient.get(`/chat?session_id=${sessionId}`);
    console.log('Fetched project details for sessionId:', sessionId, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};