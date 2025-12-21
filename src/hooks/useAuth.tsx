import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as authService from '../services/auth.service';

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville?: string;
  role: 'vendeur' | 'admin';
  credits: number;
  avatar_url?: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapApiUserToLocal(user: authService.User): User {
  const [firstName, ...rest] = (user.full_name || '').split(' ');
  return {
    id: user.id,
    email: user.email,
    nom: firstName || '',
    prenom: rest.join(' ') || '',
    telephone: user.phone,
    role: user.role === 'admin' ? 'admin' : 'vendeur',
    credits: user.credits,
    avatar_url: user.profile_image,
    verified: user.is_verified,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charge les infos stockées si présentes
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

    const mappedUser = mapApiUserToLocal(response.user);
    setToken(response.token);
    setUser(mappedUser);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
  };

  const register = async (data: any) => {
    const registerData = {
      email: data.email,
      password: data.password,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      ville: data.ville,
      role: 'vendeur' as const,
    };

    const response = await authService.register(registerData);

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || "Erreur lors de l'inscription");
    }

    const mappedUser = mapApiUserToLocal(response.user);
    setToken(response.token);
    setUser(mappedUser);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
