import { getAccessToken, getStoredLang } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessageItem {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  createdAt?: string;
}

export interface ChatResponse {
  message: ChatMessageItem;
  contextUsed?: any;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const lang = getStoredLang();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': lang,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}${endpoint}${separator}lang=${encodeURIComponent(lang)}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Chat API request failed');
  }

  return data.data;
}

export async function sendChatMessageApi(message: string): Promise<ChatResponse> {
  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function getChatHistoryApi(): Promise<ChatMessageItem[]> {
  return request<ChatMessageItem[]>('/api/chat/history');
}

export async function clearChatHistoryApi(): Promise<void> {
  return request<void>('/api/chat/history', {
    method: 'DELETE',
  });
}
