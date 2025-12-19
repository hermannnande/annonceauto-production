# 🚀 Guide de déploiement - Backend AnnonceAuto.ci

## 📋 Étapes complètes pour mettre le backend en ligne

---

## 1️⃣ PRÉPARER LA BASE DE DONNÉES (Supabase)

### Créer un projet Supabase (GRATUIT)

1. **Allez sur** https://supabase.com
2. **Sign Up** avec GitHub
3. **New Project**
   - Name: `annonceauto-backend`
   - Database Password: Générez un mot de passe fort
   - Region: **Singapore** (plus proche de la Côte d'Ivoire)
   - Plan: **Free** (500 MB, suffisant pour démarrer)
4. Attendez 2-3 minutes (création du projet)

### Récupérer la DATABASE_URL

1. Dans Supabase → **Settings** → **Database**
2. Copiez la **Connection string** en mode **URI**
3. Format: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`
4. **Remplacez `[YOUR-PASSWORD]`** par votre mot de passe

✅ **Vous avez maintenant votre DATABASE_URL !**

---

## 2️⃣ CONFIGURER CLOUDINARY (Upload images)

### Créer un compte Cloudinary (GRATUIT)

1. **Allez sur** https://cloudinary.com
2. **Sign Up**
3. Vérifiez votre email

### Récupérer les clés API

1. Dans Dashboard, vous verrez :
   - **Cloud Name** : `dxxxxxxx`
   - **API Key** : `123456789012345`
   - **API Secret** : Cliquez sur "reveal" pour voir

✅ **Vous avez vos clés Cloudinary !**

---

## 3️⃣ DÉPLOYER SUR RAILWAY

### Créer un compte Railway (GRATUIT)

1. **Allez sur** https://railway.app
2. **Login with GitHub**
3. Autorisez l'accès

### Créer un nouveau projet

1. **New Project**
2. **Deploy from GitHub repo**
3. Sélectionnez **`annonceauto-production`**
4. Railway va détecter automatiquement le backend

### Configurer le déploiement

1. **Settings** → **General**
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Ajouter les variables d'environnement

1. **Variables** → **Raw Editor**
2. Copiez-collez ceci (et remplacez les valeurs) :

```env
PORT=5000

DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxx.supabase.co:5432/postgres

JWT_SECRET=votre_secret_64_caracteres_minimum_genere_avec_crypto

CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

ORANGE_MONEY_API_KEY=a_configurer_plus_tard
MTN_MONEY_API_KEY=a_configurer_plus_tard
MOOV_MONEY_API_KEY=a_configurer_plus_tard
WAVE_API_KEY=a_configurer_plus_tard

FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173

NODE_ENV=production
```

### Générer le JWT_SECRET

Dans votre terminal local :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat dans `JWT_SECRET`.

### Déployer !

1. **Deploy** → Railway va build et déployer
2. Attendez 2-3 minutes
3. Vous aurez une URL du type : `https://annonceauto-backend-production.up.railway.app`

✅ **Votre backend est en ligne !**

---

## 4️⃣ TESTER LE BACKEND

### Test de santé

```bash
curl https://votre-backend-url.railway.app/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2025-12-18T..."
}
```

### Test d'inscription

```bash
curl -X POST https://votre-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nom": "Test",
    "prenom": "User",
    "telephone": "+225 07 12 34 56 78",
    "ville": "Abidjan"
  }'
```

✅ **Si vous recevez un token, ça fonctionne !**

---

## 5️⃣ CONNECTER LE FRONTEND AU BACKEND

### Créer un fichier de configuration API

**Créez :** `src/app/services/api.ts`

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://votre-backend-url.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Créer les services

**`src/app/services/authService.ts`**

```typescript
import api from './api';

export const authService = {
  async register(data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    ville?: string;
  }) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
```

### Ajouter l'URL de l'API dans Vercel

1. **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Ajoutez :
   - Name: `VITE_API_URL`
   - Value: `https://votre-backend-url.railway.app/api`
3. **Redéployez** le frontend

---

## 6️⃣ VÉRIFIER LE DÉPLOIEMENT

### ✅ Checklist

- [ ] Supabase projet créé et DATABASE_URL récupérée
- [ ] Cloudinary compte créé et clés récupérées
- [ ] Railway projet créé
- [ ] Variables d'environnement configurées
- [ ] Backend déployé sur Railway
- [ ] Test `/health` réussi
- [ ] Test `/api/auth/register` réussi
- [ ] Frontend connecté au backend
- [ ] Variable `VITE_API_URL` ajoutée sur Vercel
- [ ] Frontend redéployé

---

## 🔄 MISES À JOUR

### Backend

Chaque fois que vous modifiez le backend :

```bash
cd backend
git add .
git commit -m "feat: amélioration backend"
git push
```

Railway **redéploie automatiquement** en 2-3 minutes !

### Frontend

```bash
git add .
git commit -m "feat: connexion au backend"
git push
```

Vercel **redéploie automatiquement** !

---

## 📊 MONITORING

### Logs Railway

1. Railway → Votre projet → **Deployments**
2. Cliquez sur le dernier déploiement
3. **View Logs** pour voir les erreurs

### Base de données Supabase

1. Supabase → **Table Editor**
2. Vous verrez toutes vos tables
3. Vous pouvez voir les données en temps réel

---

## 💰 COÛTS

### Gratuit pour toujours :

- **Railway** : $5/mois de crédits gratuits (largement suffisant)
- **Supabase** : 500 MB de données (upgrade $25/mois si besoin)
- **Cloudinary** : 25 GB de stockage gratuit

**Coût total au démarrage : 0 FCFA ! 🎉**

---

## 🔐 SÉCURITÉ

### Production Checklist

- [x] JWT_SECRET complexe et unique
- [x] DATABASE_URL sécurisée (pas dans le code)
- [x] CORS configuré pour le bon domaine
- [x] Rate limiting activé
- [x] Helmet pour les headers HTTP
- [x] Passwords hashés avec bcrypt
- [ ] HTTPS activé (automatique sur Railway)
- [ ] Backups base de données (Supabase le fait automatiquement)

---

## 🆘 PROBLÈMES COURANTS

### Erreur "CORS"

→ Vérifiez que `FRONTEND_URL` dans Railway correspond à votre URL Vercel.

### Erreur "Database connection"

→ Vérifiez que votre DATABASE_URL est correcte dans Railway.

### Erreur "Token invalide"

→ Vérifiez que `JWT_SECRET` est identique entre tous les déploiements.

### Images ne s'uploadent pas

→ Vérifiez vos clés Cloudinary dans Railway.

---

## 🎉 TERMINÉ !

Votre stack complète est maintenant en ligne :

```
Frontend (Vercel)
    ↓
Backend (Railway)
    ↓
PostgreSQL (Supabase)
    ↓
Images (Cloudinary)
```

**Tout est connecté et fonctionnel ! 🚀**

---

**Besoin d'aide ? Consultez les logs ou contactez le support !**



