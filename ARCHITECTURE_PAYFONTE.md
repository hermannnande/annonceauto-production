# 🏗️ ARCHITECTURE PAYFONTE - AnnonceAuto.ci

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR (CLIENT)                         │
│                    http://localhost:5173                             │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ 1. Clique "Recharger"
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  src/app/pages/dashboard/VendorRecharge.tsx                 │   │
│  │  - Formulaire de recharge                                    │   │
│  │  - Sélection montant                                         │   │
│  │  - Numéro de téléphone                                       │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │                                          │
│                            │ 2. Appel payfonteService                │
│                            ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  src/services/payfonte.service.ts                           │   │
│  │  - createCheckout(amount, user, ...)                        │   │
│  │  - verifyPayment(reference)                                 │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             │ 3. POST /api/payments/payfonte/create-checkout
                             │    Body: { amount, currency, country, user }
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│               BACKEND (Node.js + Express + PostgreSQL)               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  backend/src/routes/payfonte.routes.js                      │   │
│  │                                                              │   │
│  │  POST /create-checkout                                      │   │
│  │  - Génère une référence unique                              │   │
│  │  - Crée un record "pending" dans la DB                      │   │
│  │  - Appelle l'API Payfonte                                   │   │
│  │  - Retourne l'URL de checkout                               │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │                                          │
│                            │ 4. Appel API Payfonte                   │
│                            │    Headers:                              │
│                            │      client-id: obrille                 │
│                            │      client-secret: live_6884f...       │
│                            ▼                                          │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      API PAYFONTE                                     │
│            https://api.payfonte.com/payments/v1                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  POST /checkouts                                            │   │
│  │  - Crée une session de paiement                             │   │
│  │  - Génère une URL de checkout                               │   │
│  │  - Retourne: { data: { url, reference } }                  │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             │ 5. Retourne checkoutUrl au Backend
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                         BACKEND                                       │
│  - Retourne { checkoutUrl, reference } au Frontend                  │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             │ 6. Frontend redirige l'utilisateur
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│              PAGE DE PAIEMENT PAYFONTE                                │
│         https://checkout.payfonte.com/XXXX                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  - Choix opérateur (Orange, MTN, Moov, Wave...)            │   │
│  │  - Entrée numéro de téléphone                               │   │
│  │  - Confirmation du paiement                                 │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             │ 7. Client effectue le paiement
                             │
                   ┌─────────┴──────────┐
                   │                    │
       7a. CALLBACK (Frontend)   7b. WEBHOOK (Backend)
                   │                    │
                   │                    │
┌──────────────────▼────┐  ┌───────────▼──────────────────────────────┐
│   FRONTEND CALLBACK   │  │      BACKEND WEBHOOK                     │
│  /payfonte/callback   │  │  /api/payments/payfonte/webhook         │
│                       │  │                                          │
│  PayfonteCallback.tsx │  │  payfonte.routes.js                     │
│  - Reçoit status      │  │  - Reçoit event + data de Payfonte      │
│  - Reçoit reference   │  │  - Vérifie via API Payfonte             │
│  - Appelle /verify    │  │  - Crédite l'utilisateur                │
│  - Affiche succès     │  │  - Met à jour la DB                     │
└───────────────────────┘  └──────────────────────────────────────────┘
```

---

## 🔄 Flow détaillé de paiement

### Phase 1 : Initiation du paiement

```
Client                 Frontend                Backend                Payfonte
  │                      │                       │                       │
  │ Clique "Recharger"   │                       │                       │
  ├─────────────────────>│                       │                       │
  │                      │                       │                       │
  │                      │ POST /create-checkout │                       │
  │                      ├──────────────────────>│                       │
  │                      │  {amount, user, ...}  │                       │
  │                      │                       │                       │
  │                      │                       │ POST /checkouts       │
  │                      │                       ├──────────────────────>│
  │                      │                       │  Headers: client-id   │
  │                      │                       │          client-secret│
  │                      │                       │                       │
  │                      │                       │<──────────────────────┤
  │                      │                       │  {url, reference}     │
  │                      │<──────────────────────┤                       │
  │                      │  {checkoutUrl}        │                       │
  │                      │                       │                       │
  │ Redirect vers URL    │                       │                       │
  │<─────────────────────┤                       │                       │
  │                      │                       │                       │
  ▼                      │                       │                       │
Page Payfonte            │                       │                       │
```

### Phase 2 : Paiement

```
Client                 Payfonte
  │                       │
  │ Choix opérateur       │
  ├──────────────────────>│
  │                       │
  │ Numéro téléphone      │
  ├──────────────────────>│
  │                       │
  │ Confirmation          │
  ├──────────────────────>│
  │                       │
  │ Paiement Mobile Money │
  ├──────────────────────>│
  │                       │
  │ Transaction USSD      │
  │<─────────────────────>│
  │                       │
  ▼                       ▼
```

### Phase 3 : Confirmation (Double sécurité)

```
Client                Frontend              Backend              Payfonte
  │                      │                     │                     │
  │ Redirect callback    │                     │                     │
  │─────────────────────>│                     │                     │
  │  ?status=success     │                     │                     │
  │  &reference=XXX      │                     │                     │
  │                      │                     │                     │
  │                      │ GET /verify?ref=XXX │                     │
  │                      ├────────────────────>│                     │
  │                      │                     │                     │
  │                      │                     │ GET /checkouts/XXX/verify
  │                      │                     ├────────────────────>│
  │                      │                     │                     │
  │                      │                     │<────────────────────┤
  │                      │                     │  {status: success}  │
  │                      │                     │                     │
  │                      │                     │ UPDATE DB           │
  │                      │                     │ + Add credits       │
  │                      │                     │                     │
  │                      │<────────────────────┤                     │
  │                      │  {success: true}    │                     │
  │                      │                     │                     │
  │ Affiche succès       │                     │                     │
  │<─────────────────────┤                     │                     │
  │ +XX crédits ajoutés  │                     │                     │
  │                      │                     │                     │
  │                      │                     │                     │
  │                      │                     │<────────────────────┤
  │                      │                     │  Webhook POST       │
  │                      │                     │  {event, data}      │
  │                      │                     │                     │
  │                      │                     │ GET /verify (encore)│
  │                      │                     ├────────────────────>│
  │                      │                     │                     │
  │                      │                     │ UPDATE DB (si pas   │
  │                      │                     │ déjà fait)          │
  │                      │                     │                     │
  ▼                      ▼                     ▼                     ▼
```

---

## 🗄️ Base de données

### Table : `payments`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | ID unique du paiement |
| `user_id` | INTEGER | ID de l'utilisateur |
| `amount` | INTEGER | Montant en FCFA |
| `currency` | VARCHAR(10) | Devise (XOF) |
| `payfonte_reference` | VARCHAR(255) | Référence Payfonte unique |
| `status` | VARCHAR(50) | pending / completed / failed |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

### Table : `users`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | ID unique |
| `email` | VARCHAR | Email |
| `credits` | INTEGER | Nombre de crédits |
| ... | ... | Autres champs |

### Table : `credits_transactions`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | SERIAL | ID unique |
| `user_id` | INTEGER | ID utilisateur |
| `type` | VARCHAR(50) | purchase / spend / refund |
| `amount` | INTEGER | Nombre de crédits |
| `description` | TEXT | Description |
| `payment_id` | INTEGER | ID du paiement (si applicable) |
| `created_at` | TIMESTAMP | Date |

---

## 📁 Structure des fichiers

```
Site Annonces Véhicules (2)/
│
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── PayfonteCallback.tsx         ← Callback après paiement
│   │   │   └── dashboard/
│   │   │       └── VendorRecharge.tsx       ← Page de recharge
│   │   └── App.tsx                          ← Routes (+ /payfonte/callback)
│   │
│   └── services/
│       └── payfonte.service.ts              ← Service frontend
│
├── backend/
│   ├── src/
│   │   └── routes/
│   │       └── payfonte.routes.js           ← Routes API Payfonte
│   │
│   ├── server.clean.js                      ← Serveur Express propre
│   ├── database-migration-payfonte.sql      ← Script SQL
│   └── ENV_BACKEND_TEMPLATE.txt             ← Template .env backend
│
├── LISEZ_MOI_PAYFONTE.md                    ← ⭐ Commencez ici
├── DEMARRAGE_PAYFONTE.md                    ← Guide rapide
├── PAYFONTE_INTEGRATION_COMPLETE.md         ← Guide complet
├── PAYFONTE_KEYS_CONFIGURATION.md           ← Config détaillée
├── README_PAYFONTE.md                       ← Récapitulatif technique
└── start-payfonte.ps1                       ← Script de démarrage
```

---

## 🔐 Variables d'environnement

### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:5000
VITE_SITE_URL=http://localhost:5173
```

### Backend `backend/.env`

```env
# Serveur
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000
SITE_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=annonceauto
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret

# PAYFONTE (CLÉS RÉELLES)
PAYFONTE_CLIENT_ID=obrille
PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
PAYFONTE_ENV=production
```

---

## 🌐 URLs

### Développement

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Page de recharge | http://localhost:5173/dashboard/vendeur/recharge |
| Callback | http://localhost:5173/payfonte/callback |
| Webhook | http://localhost:5000/api/payments/payfonte/webhook |
| API Payfonte | https://api.payfonte.com/payments/v1 |
| Dashboard Payfonte | https://dashboard.payfonte.com/ |

---

## 📊 Opérateurs supportés

Payfonte prend en charge tous les principaux opérateurs Mobile Money d'Afrique :

| Opérateur | Pays | Logo |
|-----------|------|------|
| Orange Money | CI, SN, ML, BF, ... | 🟠 |
| MTN Mobile Money | CI, CM, GH, UG, ... | 🟡 |
| Moov Money | CI, BJ, TG, ... | 🔵 |
| Wave | CI, SN, ... | 💙 |
| Airtel Money | GH, KE, UG, ... | 🔴 |
| Et bien d'autres... | | |

---

## 💰 Taux de conversion

```
1 crédit = 100 FCFA
```

Exemples :
- 5,000 FCFA → 50 crédits
- 10,000 FCFA → 100 crédits
- 25,000 FCFA → 250 crédits
- 50,000 FCFA → 500 crédits
- 100,000 FCFA → 1,000 crédits

---

**Architecture créée le** : 24 décembre 2024  
**Version** : 1.0  
**Stack** : React + TypeScript + Node.js + Express + PostgreSQL + Payfonte




