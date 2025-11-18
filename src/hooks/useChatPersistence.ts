import { useState, useEffect } from "react";
import { Message } from "@/types";
import { fetchProjectDetails, ChatMessage } from "@/services/projectService";

export interface ChatSession {
  sessionId: string;
  apiMessages: ChatMessage[];
  lastUpdated: number;
  projectUrl?: string;
  sitemap?: any;
  title?: string;
  githubUrl?: string;
}

/* -------------------------------------------------------
   Convert API → UI Message format (IDs always unique)
------------------------------------------------------- */
const convertApiMessageToMessage = (
  apiMessage: ChatMessage,
  index: number
): Message => ({
  id: `api_${apiMessage.id}_${apiMessage.created_at}_${index}`,
  type: apiMessage.role === "user" ? "user" : "ai",
  content: apiMessage.msg,
  timestamp: new Date(apiMessage.created_at),
});

/* -------------------------------------------------------
   Convert UI → API Message format (reverse-safe)
------------------------------------------------------- */
const convertUiMessageToApi = (
  msg: Message,
  sessionId: string
): ChatMessage => {
  const parts = msg.id.split("_");
  const numericId = Number(parts[1]) || Date.now();

  return {
    id: numericId,
    role: msg.type === "user" ? "user" : "ai",
    msg: msg.content,
    session_id: sessionId,
    created_at: msg.timestamp.toISOString(),
  };
};

/* -------------------------------------------------------
   Main Hook
------------------------------------------------------- */
export const useChatPersistence = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [projectUrl, setProjectUrl] = useState("");
  const [sitemap, setSitemap] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  /* -------------------------------------------------------
     Load messages when sessionId changes
  ------------------------------------------------------- */
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }

      setIsLoadingMessages(true);

      // keep only current session in storage
      Object.keys(sessionStorage).forEach((key) => {
        if (
          key.startsWith("chat_session_") &&
          key !== `chat_session_${sessionId}`
        ) {
          sessionStorage.removeItem(key);
        }
      });

      // attempt load from sessionStorage
      const saved = sessionStorage.getItem(`chat_session_${sessionId}`);
      if (saved) {
        try {
          const session: ChatSession = JSON.parse(saved);
          const converted = session.apiMessages.map((m, i) =>
            convertApiMessageToMessage(m, i)
          );
          setMessages(converted);

          setProjectUrl(session.projectUrl || "");
          setSitemap(session.sitemap || null);
          setTitle(session.title || "");
          setGithubUrl(session.githubUrl || "");

          setIsLoadingMessages(false);
          return;
        } catch {
          sessionStorage.removeItem(`chat_session_${sessionId}`);
        }
      }

      // fetch from API if not in storage
      try {
        const data = await fetchProjectDetails(sessionId);

        if (!data.success || !data.response) {
          setMessages([]);
          setIsLoadingMessages(false);
          return;
        }

        const converted = data.response.map((m: ChatMessage, i: number) =>
          convertApiMessageToMessage(m, i)
        );

        setMessages(converted);
        setProjectUrl(data.project_url || "");
        setSitemap(data.sitemap || null);
        setTitle(data.title || "");
        setGithubUrl(data.github_url || "");

        // save normalized API messages
        const session: ChatSession = {
          sessionId,
          apiMessages: data.response,
          projectUrl: data.project_url,
          sitemap: data.sitemap,
          title: data.title,
          githubUrl: data.github_url,
          lastUpdated: Date.now(),
        };

        sessionStorage.setItem(
          `chat_session_${sessionId}`,
          JSON.stringify(session)
        );
      } catch (err) {
        console.error(err);
        setMessages([]);
      }

      setIsLoadingMessages(false);
    };

    loadMessages();
  }, [sessionId]);

  /* -------------------------------------------------------
     Persist messages to sessionStorage
  ------------------------------------------------------- */
  useEffect(() => {
    if (!sessionId || messages.length === 0) return;

    const nonEmpty = messages.filter((m) => m.content.trim() !== "");
    if (nonEmpty.length === 0) return;

    const apiMessages = nonEmpty.map((m) =>
      convertUiMessageToApi(m, sessionId)
    );

    const session: ChatSession = {
      sessionId,
      apiMessages,
      projectUrl,
      sitemap,
      title,
      githubUrl,
      lastUpdated: Date.now(),
    };

    sessionStorage.setItem(
      `chat_session_${sessionId}`,
      JSON.stringify(session)
    );
  }, [sessionId, messages, projectUrl, sitemap, title, githubUrl]);

  /* -------------------------------------------------------
     Helpers
  ------------------------------------------------------- */
  const addMessage = (msg: Omit<Message, "id">): Message => {
    const newMessage: Message = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const updateMessage = (messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, content } : m))
    );
  };

  const clearMessages = () => {
    setMessages([]);
    if (sessionId) sessionStorage.removeItem(`chat_session_${sessionId}`);
  };

  const clearAllSessions = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("chat_session_")) sessionStorage.removeItem(key);
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
