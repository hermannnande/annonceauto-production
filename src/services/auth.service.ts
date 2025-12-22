import { API_BASE_URL } from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville?: string;
  role?: 'vendeur' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville?: string;
  role: 'vendeur' | 'admin' | 'super_admin';
  credits: number;
  verified?: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleApiError = (error: any) => {
  if (error?.response) {
    const message = error.response.data?.message || 'Une erreur est survenue';
    return { success: false, message };
  }
  if (error?.request) {
    return {
      success: false,
      message: 'Impossible de contacter le serveur. VÃ©rifiez votre connexion.',
    };
  }
  return { success: false, message: error?.message || 'Erreur inconnue' };
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.error || 'Erreur lors de l\'inscription' };
    }

    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return { success: true, token: result.token, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.error || 'Email ou mot de passe incorrect' };
    }

    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return { success: true, token: result.token, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getProfile = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.error || 'Erreur lors de la rÃ©cupÃ©ration du profil' };
    }

    localStorage.setItem('user', JSON.stringify(result.user));

    return { success: true, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProfile = async (data: Partial<Pick<User, 'nom' | 'prenom' | 'telephone' | 'email' | 'ville'>>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur de mise Ã  jour');
    }

    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  } catch (error: any) {
    throw new Error(error?.message || 'Erreur de mise Ã  jour');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'super_admin';
};

export const isVendor = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'vendeur';
};