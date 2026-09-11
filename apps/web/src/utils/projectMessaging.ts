import { useState, useEffect, useCallback } from 'react';
import { TeamComment, INITIAL_TEAM_COMMENTS } from '../components/student/studentData';

export const STORAGE_KEY_PROJECT_MESSAGES = 'samadhansetu_project_communications';
export const EVENT_MESSAGES_UPDATED = 'samadhansetu_messages_updated';

/**
 * Retrieves stored team communications from localStorage.
 * Automatically seeds with INITIAL_TEAM_COMMENTS if empty.
 */
export function getStoredProjectMessages(): TeamComment[] {
  if (typeof window === 'undefined') return INITIAL_TEAM_COMMENTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECT_MESSAGES);
    if (!raw) {
      // Seed with initial comments
      localStorage.setItem(STORAGE_KEY_PROJECT_MESSAGES, JSON.stringify(INITIAL_TEAM_COMMENTS));
      return INITIAL_TEAM_COMMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TEAM_COMMENTS;
  } catch (err) {
    console.warn('Failed to read project messages from localStorage:', err);
    return INITIAL_TEAM_COMMENTS;
  }
}

/**
 * Saves a new comment/message to localStorage and notifies all open components & tabs.
 */
export function sendProjectMessage(params: {
  author: string;
  role: string;
  avatar: string;
  message: string;
  isMentor?: boolean;
  projectId?: string;
  projectName?: string;
}): TeamComment {
  const current = getStoredProjectMessages();
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const newComment: TeamComment = {
    id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    author: params.author,
    role: params.role,
    avatar: params.avatar,
    message: params.message.trim(),
    timestamp: `Today at ${timeString} (${dateString})`,
    isMentor: params.isMentor,
    projectId: params.projectId || 'Smart Water Monitoring',
    projectName: params.projectName || 'Smart Water Monitoring (Namkum Block)',
  };

  const updated = [...current, newComment];

  try {
    localStorage.setItem(STORAGE_KEY_PROJECT_MESSAGES, JSON.stringify(updated));
    // Dispatch local custom event for same-tab reactivity
    window.dispatchEvent(new CustomEvent(EVENT_MESSAGES_UPDATED, { detail: updated }));
  } catch (err) {
    console.error('Failed to save project message to localStorage:', err);
  }

  return newComment;
}

/**
 * Resets the message store back to default demo messages.
 */
export function resetProjectMessages(): TeamComment[] {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECT_MESSAGES, JSON.stringify(INITIAL_TEAM_COMMENTS));
    window.dispatchEvent(new CustomEvent(EVENT_MESSAGES_UPDATED, { detail: INITIAL_TEAM_COMMENTS }));
  } catch (err) {
    console.error('Failed to reset project messages:', err);
  }
  return INITIAL_TEAM_COMMENTS;
}

/**
 * React hook to read and write project messages with persistent localStorage sync.
 */
export function useProjectMessages() {
  const [messages, setMessages] = useState<TeamComment[]>(getStoredProjectMessages);

  const refreshMessages = useCallback(() => {
    setMessages(getStoredProjectMessages());
  }, []);

  useEffect(() => {
    // Initial sync
    refreshMessages();

    // Listen for updates from same window / other components
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<TeamComment[]>;
      if (customEvent.detail) {
        setMessages(customEvent.detail);
      } else {
        refreshMessages();
      }
    };

    // Listen for storage events across other browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PROJECT_MESSAGES) {
        refreshMessages();
      }
    };

    window.addEventListener(EVENT_MESSAGES_UPDATED, handleLocalUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_MESSAGES_UPDATED, handleLocalUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshMessages]);

  const sendMessage = useCallback(
    (params: {
      author: string;
      role: string;
      avatar: string;
      message: string;
      isMentor?: boolean;
      projectId?: string;
      projectName?: string;
    }) => {
      return sendProjectMessage(params);
    },
    []
  );

  const resetMessages = useCallback(() => {
    return resetProjectMessages();
  }, []);

  return {
    messages,
    sendMessage,
    resetMessages,
  };
}
