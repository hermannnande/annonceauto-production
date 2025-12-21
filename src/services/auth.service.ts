import { API_BASE_URL, getAuthHeaders, handleApiError } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur de connexion');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'inscription');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Non authentifie');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'super_admin';
};

export const isVendor = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'vendeur' || isAdmin();
};

export const updateProfile = async (data: any) => {
  try {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur de mise a jour');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};