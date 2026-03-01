const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.31.204:3000/api';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
};

export async function apiFetch<T>(path: string): Promise<T> {
  const url = path ? `${API_URL}/${path}` : API_URL;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export function getApiUrl(): string {
  return API_URL;
}
