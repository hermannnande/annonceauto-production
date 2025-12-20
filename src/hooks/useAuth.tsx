import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur depuis le localStorage au dÃ©marrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
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
    
    // Mapper les donnÃ©es de l'API vers notre format
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      nom: response.user.full_name.split(' ')[0] || '',
      prenom: response.user.full_name.split(' ').slice(1).join(' ') || '',
      telephone: response.user.phone,
      role: response.user.role === 'admin' ? 'admin' : 'vendeur',
      credits: response.user.credits,
      avatar_url: response.user.profile_image,
      verified: response.user.is_verified
    };
    
    setToken(response.token);
    setUser(user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (data: any) => {
    const registerData = {
      email: data.email,
      password: data.password,
      full_name: `${data.nom} ${data.prenom}`,
      phone: data.telephone,
      role: 'vendor' as const
    };
    
    const response = await authService.register(registerData);
    
    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || 'Erreur lors de l\'inscription');
    }
    
    // Mapper les donnÃ©es de l'API vers notre format
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      nom: data.nom,
      prenom: data.prenom,
      telephone: response.user.phone,
      ville: data.ville,
      role: response.user.role === 'admin' ? 'admin' : 'vendeur',
      credits: response.user.credits,
      avatar_url: response.user.profile_image,
      verified: response.user.is_verified
    };
    
    setToken(response.token);
    setUser(user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
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
    throw new Error('useAuth doit Ãªtre utilisÃ© Ã  l\'intÃ©rieur d\'un AuthProvider');
  }
  return context;
}
