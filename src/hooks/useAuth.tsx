import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authService from '../services/auth.service';

export type UserRole = 'vendeur' | 'admin' | 'super_admin';

export type User = authService.User;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: authService.RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  // Charger depuis le storage au demarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || 'Erreur de connexion');
    }

    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const register = async (data: authService.RegisterData) => {
    const response = await authService.register(data);

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || "Erreur lors de l'inscription");
    }

    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  const refreshUser = async () => {
    if (!token) return;

    const response = await authService.getProfile();
    if (!response.success || !response.user) {
      // Token invalide/expire, on deconnecte
      logout();
      throw new Error(response.message || 'Session expiree. Veuillez vous reconnecter.');
    }

    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un AuthProvider");
  }
  return context;
}
