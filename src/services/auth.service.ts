import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role?: 'vendor' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'vendor' | 'admin';
  credits: number;
  profile_image?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de l\'inscription' };
    }

    // Sauvegarder le token et les infos utilisateur
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return { success: true, token: result.token, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Email ou mot de passe incorrect' };
    }

    // Sauvegarder le token et les infos utilisateur
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return { success: true, token: result.token, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.auth.profile, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la récupération du profil' };
    }

    // Mettre à jour les infos utilisateur
    localStorage.setItem('user', JSON.stringify(result.user));

    return { success: true, user: result.user };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Déconnexion
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Récupérer l'utilisateur depuis le localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Vérifier si l'utilisateur est admin
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Vérifier si l'utilisateur est vendeur
 */
export const isVendor = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'vendor';
};

