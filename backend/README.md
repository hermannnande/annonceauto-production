# 🚗 AnnonceAuto.ci - Backend API

API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**



API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**







API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**



API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**







API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**



API REST complète pour la plateforme AnnonceAuto.ci

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créez un fichier `.env` basé sur `env.example`:

```bash
cp env.example .env
```

Modifiez les variables :

```env
PORT=5000

# Base de données PostgreSQL (Supabase gratuit)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (générez avec la commande ci-dessous)
JWT_SECRET=votre_secret_super_long_64_caracteres_minimum

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mobile Money (à configurer plus tard)
ORANGE_MONEY_API_KEY=...
MTN_MONEY_API_KEY=...
MOOV_MONEY_API_KEY=...
WAVE_API_KEY=...

# Frontend URL
FRONTEND_URL=https://annonceauto-production.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

### 3. Générer un JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Créer la base de données

**Option A : Supabase (Recommandé - Gratuit)**

1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` dans Settings → Database
4. Collez dans votre `.env`

**Option B : PostgreSQL Local**

```bash
createdb annonceauto
```

### 5. Créer les tables

Le serveur créera automatiquement les tables au démarrage.

Ou manuellement :

```bash
npm run setup
```

### 6. Lancer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur **http://localhost:5000**

---

## 📚 Documentation API

### Base URL

```
http://localhost:5000/api
```

### Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 🔐 Authentification (`/api/auth`)

### POST `/auth/register` - Inscription

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+225 07 12 34 56 78",
  "ville": "Abidjan"
}
```

**Response:**
```json
{
  "message": "Inscription réussie ! 5 crédits offerts 🎉",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nom": "Doe",
    "prenom": "John",
    "credits": 5
  }
}
```

### POST `/auth/login` - Connexion

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET `/auth/me` - Profil actuel

**Headers:** `Authorization: Bearer <token>`

---

## 🚗 Véhicules (`/api/vehicles`)

### GET `/vehicles` - Lister les annonces

**Query params:**
- `marque` - Filtrer par marque
- `prixMin` / `prixMax` - Fourchette de prix
- `ville` - Filtrer par ville
- `page` / `limit` - Pagination
- `sort` - Tri (`recent`, `prix_asc`, `prix_desc`)

**Response:**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/vehicles/:id` - Détail annonce

### POST `/vehicles` - Créer une annonce

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "titre": "Toyota Camry 2020",
  "description": "...",
  "marque": "Toyota",
  "modele": "Camry",
  "annee": 2020,
  "prix": 15000000,
  "kilometrage": "50000 km",
  "carburant": "Essence",
  "transmission": "Automatique",
  "ville": "Abidjan",
  "images": ["url1", "url2"],
  "equipements": ["Climatisation", "GPS"]
}
```

**Coût:** 1 crédit

### PUT `/vehicles/:id` - Modifier annonce

### DELETE `/vehicles/:id` - Supprimer annonce

### GET `/vehicles/user/my-listings` - Mes annonces

---

## 💰 Crédits (`/api/credits`)

### POST `/credits/recharge` - Recharger

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "montant": 5000,
  "methode": "orange",
  "telephone": "+225 07 12 34 56 78"
}
```

**Taux:** 1 crédit = 1000 FCFA

### POST `/credits/boost/:vehicleId` - Booster annonce

**Body:**
```json
{
  "type": "standard"
}
```

**Types:**
- `standard` - 5 crédits, 7 jours
- `premium` - 10 crédits, 14 jours
- `super` - 20 crédits, 30 jours

### GET `/credits/history` - Historique

### GET `/credits/balance` - Solde

---

## 📤 Upload (`/api/upload`)

### POST `/upload` - Upload images

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body:** FormData avec champ `images` (max 10 fichiers)

**Response:**
```json
{
  "message": "Images uploadées",
  "images": [
    "https://res.cloudinary.com/..."
  ]
}
```

---

## 👥 Utilisateurs (`/api/users`)

### GET `/users` - Liste (Admin)

### GET `/users/:id` - Détail

### PUT `/users/:id` - Modifier profil

### DELETE `/users/:id` - Supprimer compte

---

## 🗄️ Structure de la base de données

### Tables

- **users** - Utilisateurs (vendeurs, admins)
- **vehicles** - Annonces de véhicules
- **credits_history** - Historique des crédits
- **payments** - Transactions Mobile Money
- **boosts** - Historique des boosts
- **messages** - Messages vendeurs

---

## 🚀 Déploiement

### Railway (Recommandé)

1. Créez un compte sur https://railway.app
2. Nouveau projet → Deploy from GitHub
3. Sélectionnez votre repo
4. Railway détecte automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Ajoutez PostgreSQL via Railway
7. Déployez ! 🎉

### Variables d'environnement Railway

Ajoutez toutes les variables du fichier `.env` dans Railway.

---

## 📊 Statistiques

- **5 crédits offerts** à l'inscription
- **1 crédit** = 1000 FCFA
- **1 crédit** pour publier une annonce
- **5-20 crédits** pour booster une annonce

---

## 🔒 Sécurité

- ✅ Helmet pour headers HTTP sécurisés
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuré
- ✅ JWT avec expiration 30 jours
- ✅ Passwords hashés avec bcrypt
- ✅ Validation des données (express-validator)

---

## 🐛 Debugging

```bash
# Logs détaillés
NODE_ENV=development npm run dev

# Tester la connexion DB
node -e "require('./src/config/database.js').query('SELECT NOW()')"
```

---

## 📝 TODO

- [ ] Intégrer vraies API Mobile Money
- [ ] Système de notifications (emails)
- [ ] Système de favoris
- [ ] Messagerie vendeur-acheteur
- [ ] Dashboard admin avancé
- [ ] Tests unitaires
- [ ] Documentation Swagger/OpenAPI

---

## 🆘 Support

Pour toute question : hermannnande@example.com

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**







