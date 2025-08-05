import { useState, useEffect } from 'react';
import { Message } from '@/types';

export interface ChatSession {
  sessionId: string;
  messages: Message[];
  lastUpdated: number;
}

export const useChatPersistence = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on mount or when sessionId changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    const savedSession = sessionStorage.getItem(`chat_session_${sessionId}`);
    if (savedSession) {
      try {
        const session: ChatSession = JSON.parse(savedSession);
        setMessages(session.messages || []);
      } catch (error) {
        console.error('Error loading chat session:', error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
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
    addMessage,
    updateMessage,
    clearMessages,
    clearAllSessions,
    setMessages,
  };
};