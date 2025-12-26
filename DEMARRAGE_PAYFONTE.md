# 🚀 DÉMARRAGE RAPIDE - PAYFONTE

## ⚡ En 3 étapes

### 1️⃣ Configuration (À faire UNE SEULE FOIS)

```powershell
# Créer .env.local à la racine
ni .env.local
```

Copiez dedans :
```env
VITE_API_URL=http://localhost:5000
VITE_SITE_URL=http://localhost:5173
```

```powershell
# Créer backend/.env
cd backend
ni .env
```

Copiez dedans (contenu de `backend/ENV_BACKEND_TEMPLATE.txt`) :
```env
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000
SITE_URL=http://localhost:5173

# Vos credentials PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=annonceauto
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt

# PAYFONTE (VOS VRAIES CLÉS)
PAYFONTE_CLIENT_ID=obrille
PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
PAYFONTE_ENV=production
```

### 2️⃣ Mise à jour de la base de données (À faire UNE SEULE FOIS)

```powershell
# Depuis la racine du projet
psql -U postgres -d annonceauto -f backend/database-migration-payfonte.sql
```

Ou connectez-vous à PostgreSQL et exécutez :
```sql
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payfonte_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'XOF';

CREATE INDEX IF NOT EXISTS idx_payments_payfonte_reference 
ON payments(payfonte_reference);
```

### 3️⃣ Démarrer les serveurs

#### Option A : Script automatique (Recommandé)

```powershell
.\start-payfonte.ps1
```

#### Option B : Manuel

Terminal 1 (Backend) :
```powershell
cd backend
npm start
```

Terminal 2 (Frontend) :
```powershell
pnpm dev
```

---

## 🌐 Accéder au site

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Page de recharge** : http://localhost:5173/dashboard/vendeur/recharge

---

## 🔐 Configurer le Webhook Payfonte

1. Allez sur https://dashboard.payfonte.com/
2. Settings → Webhooks
3. Ajoutez : `http://localhost:5000/api/payments/payfonte/webhook`
4. Événements : `checkout.successful`, `checkout.failed`

---

## ⚠️ IMPORTANT

- Vous êtes en **MODE PRODUCTION** avec vos vraies clés Payfonte
- Les paiements seront **RÉELS**
- Pour tester sans argent réel, demandez des clés **sandbox** à Payfonte

---

## 📚 Documentation complète

- **`PAYFONTE_INTEGRATION_COMPLETE.md`** - Guide complet
- **`PAYFONTE_KEYS_CONFIGURATION.md`** - Configuration détaillée

---

## 🆘 Problèmes ?

### Backend ne démarre pas
- Vérifiez que PostgreSQL est lancé
- Vérifiez les credentials dans `backend/.env`

### "Cannot find module payfonte.routes"
- Vérifiez que `backend/src/routes/payfonte.routes.js` existe
- Remplacez `backend/server.js` par `backend/server.clean.js` :
  ```powershell
  cd backend
  mv server.js server.js.old
  mv server.clean.js server.js
  ```

### Les crédits ne sont pas ajoutés
- Vérifiez que le webhook est configuré dans Payfonte
- Regardez les logs du backend (recherchez `[PAYFONTE WEBHOOK]`)

---

## ✅ Checklist

- [ ] `.env.local` créé à la racine
- [ ] `backend/.env` créé
- [ ] Base de données mise à jour (colonnes `payfonte_reference`, `currency`)
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 5173)
- [ ] Webhook configuré dans Payfonte

---

C'est tout ! 🎉




