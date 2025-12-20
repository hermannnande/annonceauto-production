const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://annonceauto-backend.up.railway.app';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, { ...options, headers: { ...getHeaders(), ...options.headers } });
    const data = await response.json();
    if (!response.ok) return { error: data.error || data.message || 'Une erreur est survenue' };
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Erreur de connexion au serveur' };
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) => apiRequest<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export { API_BASE_URL };
export default api;
