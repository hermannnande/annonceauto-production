# 🎯 Guide d'Intégration Frontend-Backend
# AnnonceAuto.ci

## ✅ Fichiers Créés

### Configuration API
- `src/config/api.ts` - Configuration centrale de l'API
- `src/services/auth.service.ts` - Service d'authentification
- `src/services/vehicle.service.ts` - Service de gestion des véhicules
- `src/services/upload.service.ts` - Service d'upload d'images

### Pages Mises à Jour
- `src/app/pages/LoginPage.tsx` - Connexion avec API
- `src/app/pages/RegisterPage.tsx` - Inscription avec API

## 🔗 URL de l'API Backend

```
https://annonceauto-production-production.up.railway.app
```

## 📋 Comptes de Test

### Admin
- **Email**: `admin@annonceauto.ci`
- **Mot de passe**: `Admin@2025`
- **Rôle**: Administrateur
- **Crédits**: 1000

### Vendeur
- **Email**: `vendeur@test.ci`
- **Mot de passe**: `Vendeur@2025`
- **Rôle**: Vendeur
- **Crédits**: 50

## 🚀 Endpoints Disponibles

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `GET /api/vehicles/:id` - Détail d'un véhicule
- `POST /api/vehicles` - Créer une annonce (auth requise)
- `PUT /api/vehicles/:id` - Modifier une annonce (auth requise)
- `DELETE /api/vehicles/:id` - Supprimer une annonce (auth requise)
- `GET /api/vehicles/my-vehicles` - Mes annonces (auth requise)
- `POST /api/vehicles/:id/view` - Incrémenter vues
- `POST /api/vehicles/:id/whatsapp` - Incrémenter contacts WhatsApp

### Crédits & Paiements
- `POST /api/credits/recharge` - Recharger des crédits (auth requise)
- `POST /api/credits/boost/:id` - Booster une annonce (auth requise)
- `GET /api/credits/history` - Historique des transactions (auth requise)
- `POST /api/payments/initiate` - Initier un paiement Mobile Money
- `POST /api/payments/verify` - Vérifier un paiement

### Admin
- `GET /api/users` - Liste des utilisateurs (admin only)
- `GET /api/users/:id` - Détail utilisateur (admin only)
- `PUT /api/users/:id/toggle-status` - Activer/Désactiver utilisateur (admin only)
- `PUT /api/vehicles/:id/moderate` - Modérer une annonce (admin only)

### Upload
- `POST /api/upload/image` - Upload d'image vers Cloudinary (auth requise)

## 💻 Utilisation dans le Code

### Authentification

```typescript
import { login, register, getCurrentUser, isAuthenticated } from '../../services/auth.service';

// Connexion
const result = await login({ email, password });
if (result.success) {
  // Redirection selon le rôle
  if (result.user?.role === 'admin') {
    navigate('/dashboard/admin');
  } else {
    navigate('/dashboard/vendeur');
  }
}

// Inscription
const result = await register({
  email,
  password,
  full_name,
  phone,
  role: 'vendor'
});

// Vérifier si connecté
if (isAuthenticated()) {
  const user = getCurrentUser();
}
```

### Gestion des Véhicules

```typescript
import { getVehicles, getVehicleDetail, createVehicle } from '../../services/vehicle.service';

// Récupérer la liste
const result = await getVehicles({
  status: 'active',
  brand: 'Toyota',
  minPrice: 5000000,
  maxPrice: 15000000
});

// Créer une annonce
const result = await createVehicle({
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  price: 10000000,
  images: ['url1', 'url2'],
  // ...
});
```

### Upload d'Images

```typescript
import { uploadImage, uploadMultipleImages } from '../../services/upload.service';

// Upload d'une image
const result = await uploadImage(file);
if (result.success) {
  console.log('URL:', result.url);
}

// Upload multiple
const result = await uploadMultipleImages([file1, file2, file3]);
if (result.success) {
  console.log('URLs:', result.urls);
}
```

## 🔐 Authentification JWT

Le token JWT est automatiquement :
- Sauvegardé dans le `localStorage` lors de la connexion
- Ajouté aux headers des requêtes via `getAuthHeaders()`
- Vérifié par le backend sur les routes protégées

## 🌍 Variables d'Environnement

Créer un fichier `.env` ou `.env.production` :

```env
VITE_API_URL=https://annonceauto-production-production.up.railway.app
VITE_APP_ENV=production
```

## ⚠️ Gestion des Erreurs

Toutes les fonctions de service retournent un objet avec :
```typescript
{
  success: boolean;
  message?: string;
  // ... autres données
}
```

Exemple :
```typescript
const result = await login({ email, password });
if (!result.success) {
  setError(result.message || 'Erreur inconnue');
}
```

## 📦 Prochaines Étapes

1. ✅ Backend déployé sur Railway
2. ✅ Base de données créée sur Supabase
3. ✅ Services API créés dans le frontend
4. ✅ Pages Login/Register connectées à l'API
5. 🔄 À faire :
   - Connecter PublishPage à l'API
   - Connecter VehicleDetailPage à l'API
   - Connecter ListingsPage à l'API
   - Connecter les dashboards à l'API
   - Implémenter l'upload d'images Cloudinary
   - Intégrer les paiements Mobile Money

## 🧪 Tests

### Test de Santé
```bash
curl https://annonceauto-production-production.up.railway.app/health
```

### Test de Connexion
```bash
curl -X POST https://annonceauto-production-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@annonceauto.ci","password":"Admin@2025"}'
```

## 📝 Notes Importantes

- **CORS est configuré** pour accepter toutes les origines en développement
- **Rate limiting** : 100 requêtes par 15 minutes par IP
- **Helmet** : Sécurité HTTP activée
- **JWT** : Expire après 7 jours
- **Cloudinary** : Nécessite configuration des variables d'environnement
- **Mobile Money** : Nécessite les clés API des opérateurs

## 🎉 Félicitations !

Votre backend est maintenant opérationnel et votre frontend est prêt à communiquer avec lui !
