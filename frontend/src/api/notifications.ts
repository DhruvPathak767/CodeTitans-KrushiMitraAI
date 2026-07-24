import { getAccessToken, getStoredLang } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface NotificationItem {
  _id: string;
  userId: string;
  farmId?: string;
  title: string;
  message: string;
  type: 'rain' | 'disease' | 'heat' | 'harvest' | 'irrigation' | 'spray' | 'ai' | 'scheme' | 'market' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  language: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
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
    throw new Error(data.message || 'Notification API request failed');
  }

  return data.data;
}

export async function getNotificationsApi(): Promise<NotificationsResponse> {
  return request<NotificationsResponse>('/api/notifications');
}

export async function markNotificationReadApi(id: string): Promise<void> {
  return request<void>('/api/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export async function markAllNotificationsReadApi(): Promise<void> {
  return request<void>('/api/notifications/read-all', {
    method: 'POST',
  });
}

export async function deleteNotificationApi(id?: string): Promise<void> {
  const endpoint = id ? `/api/notifications?id=${encodeURIComponent(id)}` : '/api/notifications';
  return request<void>(endpoint, {
    method: 'DELETE',
  });
}
