import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { fetchProjectDetails, ChatMessage } from '@/services/projectService';

export interface ChatSession {
  sessionId: string;
  apiMessages: ChatMessage[]; // Store in API format for consistency
  lastUpdated: number;
  projectUrl?: string;
  sitemap?: any;
  title?: string;
  githubUrl?: string;
}

const convertApiMessageToMessage = (apiMessage: ChatMessage): Message => ({
  id: `api_${apiMessage.id}`,
  type: apiMessage.role === 'user' ? 'user' : 'ai',
  content: apiMessage.msg,
  timestamp: new Date(apiMessage.created_at),
});

export const useChatPersistence = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [projectUrl, setProjectUrl] = useState<string>('');
  const [sitemap, setSitemap] = useState<any>(null);
  const [title, setTitle] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');

  // Load messages from sessionStorage or API on mount or when sessionId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        console.log('📝 No sessionId provided, clearing messages');
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      console.log('📝 Loading messages for sessionId:', sessionId);

      // Clear all previous chat sessions - only keep current one
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('chat_session_') && key !== `chat_session_${sessionId}`) {
          sessionStorage.removeItem(key);
        }
      });

      setIsLoadingMessages(true);

      try {
        // First try to load from sessionStorage
        const savedSession = sessionStorage.getItem(`chat_session_${sessionId}`);
        console.log('📝 Checking sessionStorage for:', `chat_session_${sessionId}`, savedSession ? 'Found' : 'Not found');
        
        if (savedSession) {
          try {
            const session: ChatSession = JSON.parse(savedSession);
            
            // Convert stored API messages to Message format
            if (session.apiMessages && Array.isArray(session.apiMessages)) {
              const convertedMessages = session.apiMessages.map(convertApiMessageToMessage);
              console.log('📝 Loaded from sessionStorage:', convertedMessages.length, 'messages');
              setMessages(convertedMessages);
              setProjectUrl(session.projectUrl || '');
              setSitemap(session.sitemap || null);
              setTitle(session.title || '');
              setGithubUrl(session.githubUrl || '');
              setIsLoadingMessages(false);
              return;
            }
          } catch (error) {
            console.error('Error parsing chat session from storage:', error);
            sessionStorage.removeItem(`chat_session_${sessionId}`);
            // Continue to API fetch
          }
        }

        // If not in sessionStorage, load from API
        try {
          console.log('📝 Fetching from API for sessionId:', sessionId);
          const projectDetails = await fetchProjectDetails(sessionId);
          console.log('📝 API response:', projectDetails);
          
          if (projectDetails.success && projectDetails.response) {
            // Convert to Message format for display
            const convertedMessages = projectDetails.response.map(convertApiMessageToMessage);
            console.log('📝 Loaded from API:', convertedMessages.length, 'messages');
            setMessages(convertedMessages);
            setProjectUrl(projectDetails.project_url || '');
            setSitemap(projectDetails.sitemap || null);
            setTitle(projectDetails.title || '');
            setGithubUrl(projectDetails.github_url || '');
            
            // Save raw API format to sessionStorage for consistency
            const session: ChatSession = {
              sessionId,
              apiMessages: projectDetails.response, // Store raw API format
              projectUrl: projectDetails.project_url || '',
              sitemap: projectDetails.sitemap || null,
              title: projectDetails.title || '',
              githubUrl: projectDetails.github_url || '',
              lastUpdated: Date.now(),
            };
            sessionStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
            console.log('📝 Saved to sessionStorage in API format');
          } else {
            console.log('📝 API returned unsuccessful or no response');
            sessionStorage.removeItem(`chat_session_${sessionId}`);
            setMessages([]);
          }
        } catch (apiError) {
          console.error('📝 Error loading messages from API:', apiError);
          sessionStorage.removeItem(`chat_session_${sessionId}`);
          setMessages([]);
        }
      } catch (error) {
        console.error('📝 Error in loadMessages:', error);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [sessionId]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (!sessionId || messages.length === 0) return;

    // Convert Message format back to API format for storage consistency
    const apiMessages: ChatMessage[] = messages.map(msg => ({
      id: parseInt(msg.id.replace('msg_', '').replace('api_', '')) || 0,
      role: msg.type === 'user' ? 'user' : 'ai',
      msg: msg.content,
      session_id: sessionId,
      created_at: msg.timestamp.toISOString(),
    }));

    const session: ChatSession = {
      sessionId,
      apiMessages, // Store in API format
      projectUrl,
      sitemap,
      title,
      githubUrl,
      lastUpdated: Date.now(),
    };

    sessionStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
  }, [sessionId, messages, projectUrl, sitemap, title, githubUrl]);

  const addMessage = (message: Omit<Message, 'id'>): Message => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const updateMessage = (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content } : msg
    ));
  };

  const clearMessages = () => {
    setMessages([]);
    if (sessionId) {
      sessionStorage.removeItem(`chat_session_${sessionId}`);
    }
  };

  const clearAllSessions = () => {
    // Clear all chat sessions from sessionStorage
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('chat_session_')) {
        sessionStorage.removeItem(key);
      }
    });
    setMessages([]);
  };

  return {
    messages,
    isLoadingMessages,
    addMessage,
    updateMessage,
    clearMessages,
    clearAllSessions,
    setMessages,
    projectUrl,
    sitemap,
    title,
    githubUrl,
    setProjectUrl,
    setSitemap,
    setTitle,
    setGithubUrl,
  };
};