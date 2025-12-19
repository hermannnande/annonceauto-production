# 🔌 Guide d'intégration Frontend ↔ Backend

## 📋 Fichiers à créer dans le frontend

---

## 1️⃣ Configuration API de base

**Créez:** `src/app/services/api.ts`

```typescript
import axios from 'axios';

// URL du backend (Vercel utilisera la variable d'environnement)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 2️⃣ Service d'authentification

**Créez:** `src/app/services/authService.ts`

```typescript
import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  ville?: string;
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
  role: 'vendeur' | 'admin';
  credits: number;
  avatar_url?: string;
}

export const authService = {
  // Inscription
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Connexion
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Profil actuel
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data.user;
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Utilisateur connecté
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Vérifie si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  // Vérifie si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },
};
```

---

## 3️⃣ Service des véhicules

**Créez:** `src/app/services/vehicleService.ts`

```typescript
import api from './api';

export interface Vehicle {
  id: number;
  titre: string;
  description: string;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  kilometrage: string;
  carburant: string;
  transmission: string;
  couleur?: string;
  ville: string;
  commune?: string;
  images: string[];
  equipements: string[];
  statut: 'en_attente' | 'approuve' | 'rejete' | 'vendu';
  boost_level: number;
  vues: number;
  favoris: number;
  created_at: string;
}

export interface VehicleFilters {
  marque?: string;
  modele?: string;
  anneeMin?: number;
  anneeMax?: number;
  prixMin?: number;
  prixMax?: number;
  ville?: string;
  carburant?: string;
  transmission?: string;
  page?: number;
  limit?: number;
  sort?: 'recent' | 'prix_asc' | 'prix_desc' | 'ancien';
}

export const vehicleService = {
  // Lister les annonces
  async getAll(filters?: VehicleFilters) {
    const response = await api.get('/vehicles', { params: filters });
    return response.data;
  },

  // Détail d'une annonce
  async getById(id: number | string) {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.vehicle;
  },

  // Créer une annonce (coûte 1 crédit)
  async create(data: Partial<Vehicle>) {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  // Modifier une annonce
  async update(id: number, data: Partial<Vehicle>) {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },

  // Supprimer une annonce
  async delete(id: number) {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Mes annonces
  async getMyListings() {
    const response = await api.get('/vehicles/user/my-listings');
    return response.data.vehicles;
  },
};
```

---

## 4️⃣ Service des crédits

**Créez:** `src/app/services/creditService.ts`

```typescript
import api from './api';

export type PaymentMethod = 'orange' | 'mtn' | 'moov' | 'wave';
export type BoostType = 'standard' | 'premium' | 'super';

export const creditService = {
  // Recharger le compte
  async recharge(montant: number, methode: PaymentMethod, telephone: string) {
    const response = await api.post('/credits/recharge', {
      montant,
      methode,
      telephone,
    });
    return response.data;
  },

  // Booster une annonce
  async boostVehicle(vehicleId: number, type: BoostType) {
    const response = await api.post(`/credits/boost/${vehicleId}`, { type });
    return response.data;
  },

  // Historique des crédits
  async getHistory() {
    const response = await api.get('/credits/history');
    return response.data.history;
  },

  // Historique des paiements
  async getPayments() {
    const response = await api.get('/credits/payments');
    return response.data.payments;
  },

  // Solde actuel
  async getBalance() {
    const response = await api.get('/credits/balance');
    return response.data;
  },
};
```

---

## 5️⃣ Service d'upload d'images

**Créez:** `src/app/services/uploadService.ts`

```typescript
import api from './api';

export const uploadService = {
  // Upload multiple images
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.images; // Array of URLs
  },

  // Supprimer une image
  async deleteImage(imageUrl: string) {
    const response = await api.delete('/upload', {
      data: { imageUrl },
    });
    return response.data;
  },
};
```

---

## 6️⃣ Service utilisateur

**Créez:** `src/app/services/userService.ts`

```typescript
import api from './api';

export const userService = {
  // Détail utilisateur
  async getById(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Modifier profil
  async updateProfile(id: number, data: any) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Supprimer compte
  async deleteAccount(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
```

---

## 7️⃣ Exemples d'utilisation dans les composants

### LoginPage.tsx

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login({ email, password });
      navigate('/dashboard/vendeur');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
```

### PublishPage.tsx

```typescript
import { useState } from 'react';
import { vehicleService } from '../services/vehicleService';
import { uploadService } from '../services/uploadService';

export function PublishPage() {
  const [formData, setFormData] = useState({
    titre: '',
    marque: '',
    prix: 0,
    // ... autres champs
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload des images
      const imageUrls = await uploadService.uploadImages(images);

      // 2. Créer l'annonce
      await vehicleService.create({
        ...formData,
        images: imageUrls,
      });

      alert('Annonce créée avec succès !');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### VendorRecharge.tsx

```typescript
import { useState } from 'react';
import { creditService } from '../services/creditService';

export function VendorRecharge() {
  const [montant, setMontant] = useState(5000);
  const [methode, setMethode] = useState<'orange' | 'mtn' | 'moov' | 'wave'>('orange');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    setLoading(true);

    try {
      const result = await creditService.recharge(montant, methode, telephone);
      
      // Rediriger vers page de remerciement
      window.location.href = `/merci?amount=${montant}&credits=${result.transaction.credits}&method=${methode}&transactionId=${result.transaction.transactionId}`;
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* UI de recharge */}
      <button onClick={handleRecharge} disabled={loading}>
        {loading ? 'Traitement...' : 'Payer'}
      </button>
    </div>
  );
}
```

---

## 8️⃣ Variable d'environnement Vercel

1. **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez :
   - **Name:** `VITE_API_URL`
   - **Value:** `https://votre-backend-railway.up.railway.app/api`
3. **Redéployez** le site

---

## 🎯 Checklist d'intégration

- [ ] Fichier `api.ts` créé
- [ ] Service `authService.ts` créé
- [ ] Service `vehicleService.ts` créé
- [ ] Service `creditService.ts` créé
- [ ] Service `uploadService.ts` créé
- [ ] Service `userService.ts` créé
- [ ] LoginPage connecté au backend
- [ ] RegisterPage connecté au backend
- [ ] PublishPage connecté au backend
- [ ] VendorRecharge connecté au backend
- [ ] Variable `VITE_API_URL` ajoutée sur Vercel
- [ ] Frontend redéployé
- [ ] Tests effectués

---

## ✅ TEST FINAL

1. Inscription d'un nouveau compte
2. Connexion
3. Voir le solde (5 crédits offerts)
4. Créer une annonce (coûte 1 crédit)
5. Recharger le compte
6. Booster une annonce

**Si tout fonctionne, votre site est 100% opérationnel ! 🎉**

---

**Bon courage ! 💪**


