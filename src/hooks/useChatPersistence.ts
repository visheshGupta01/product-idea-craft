import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { fetchProjectDetails, ChatMessage } from '@/services/projectService';

export interface ChatSession {
  sessionId: string;
  messages: Message[];
  lastUpdated: number;
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

  // Load messages from localStorage or API on mount or when sessionId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }

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
        
        if (savedSession) {
          try {
            const session: ChatSession = JSON.parse(savedSession);
            setMessages(session.messages || []);
            setIsLoadingMessages(false);
            return;
          } catch (error) {
            console.error('Error loading chat session from storage:', error);
          }
        }

        // If not in sessionStorage, load from API
        try {
          const projectDetails = await fetchProjectDetails(sessionId);
          if (projectDetails.success && projectDetails.response) {
            const apiMessages = projectDetails.response.map(convertApiMessageToMessage);
            setMessages(apiMessages);
            
            // Save to sessionStorage for future use
            const session: ChatSession = {
              sessionId,
              messages: apiMessages,
              lastUpdated: Date.now(),
            };
            sessionStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
          } else {
            setMessages([]);
          }
        } catch (apiError) {
          console.error('Error loading messages from API:', apiError);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error in loadMessages:', error);
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

    const session: ChatSession = {
      sessionId,
      messages,
      lastUpdated: Date.now(),
    };

    sessionStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(session));
  }, [sessionId, messages]);

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
  };
};