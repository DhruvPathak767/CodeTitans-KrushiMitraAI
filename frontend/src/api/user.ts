import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UserLanguageResponse {
  language: 'en' | 'hi' | 'gu';
  preferredLanguage: string;
}

export async function getUserLanguageApi(): Promise<UserLanguageResponse> {
  const token = getAccessToken();
  if (!token) return { language: 'en', preferredLanguage: 'English' };

  const res = await fetch(`${API_BASE_URL}/api/user/language`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user language');
  return data.data;
}

export async function updateUserLanguageApi(language: 'en' | 'hi' | 'gu'): Promise<UserLanguageResponse> {
  const token = getAccessToken();
  if (!token) return { language, preferredLanguage: language === 'hi' ? 'Hindi' : language === 'gu' ? 'Gujarati' : 'English' };

  const res = await fetch(`${API_BASE_URL}/api/user/language`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ language }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update user language');
  return data.data;
}
