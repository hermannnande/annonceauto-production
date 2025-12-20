import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterData } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = authService.getCurrentUser();
        const token = authService.getToken();
        if (savedUser && token) {
          setUser(savedUser);
          const result = await authService.fetchCurrentUser();
          if (result.user) setUser(result.user);
          else if (result.error) { authService.logout(); setUser(null); }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.login(credentials);
      if (result.error) return { success: false, error: result.error };
      if (result.user) { setUser(result.user); return { success: true }; }
      return { success: false, error: 'Erreur inattendue' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.register(data);
      if (result.error) return { success: false, error: result.error };
      if (result.user) { setUser(result.user); return { success: true }; }
      return { success: false, error: 'Erreur inattendue' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Erreur lors de l inscription' };
    }
  };

  const logout = () => { authService.logout(); setUser(null); };

  const refreshUser = async () => {
    const result = await authService.fetchCurrentUser();
    if (result.user) setUser(result.user);
  };

  const value: AuthContextType = { user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default useAuth;
