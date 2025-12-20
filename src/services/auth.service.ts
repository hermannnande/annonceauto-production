import api from '../config/api';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: 'vendeur' | 'admin';
  credits: number;
  verified: boolean;
  avatar?: string;
}

export interface LoginCredentials { email: string; password: string; }
export interface RegisterData { email: string; password: string; nom: string; prenom: string; telephone: string; }
export interface AuthResponse { user: User; token: string; message?: string; }

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user?: User; token?: string; error?: string }> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    if (response.error) return { error: response.error };
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { user: response.data.user, token: response.data.token };
    }
    return { error: 'Reponse inattendue du serveur' };
  },

  async register(data: RegisterData): Promise<{ user?: User; token?: string; error?: string }> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    if (response.error) return { error: response.error };
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { user: response.data.user, token: response.data.token };
    }
    return { error: 'Reponse inattendue du serveur' };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { return JSON.parse(userStr); } catch { return null; }
    }
    return null;
  },

  getToken(): string | null { return localStorage.getItem('token'); },

  isAuthenticated(): boolean { return !!this.getToken() && !!this.getCurrentUser(); },

  async fetchCurrentUser(): Promise<{ user?: User; error?: string }> {
    const response = await api.get<{ user: User }>('/api/auth/me');
    if (response.error) return { error: response.error };
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { user: response.data.user };
    }
    return { error: 'Utilisateur non trouve' };
  },

  async forgotPassword(email: string): Promise<{ message?: string; error?: string }> {
    const response = await api.post<{ message: string }>('/api/auth/forgot-password', { email });
    if (response.error) return { error: response.error };
    return { message: response.data?.message };
  },
};

export default authService;
