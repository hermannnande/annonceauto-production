# 🚗 AnnonceAuto.ci

Plateforme moderne de vente de véhicules pour la Côte d'Ivoire.

## 🎯 Fonctionnalités

### Public
- 🏠 Page d'accueil avec véhicules en vedette
- 🔍 Recherche avancée multi-critères
- 📱 Design responsive et mobile-first
- 🎨 Interface moderne avec animations fluides

### Vendeurs
- 📝 Création d'annonces
- 💳 Système de crédits Mobile Money
- 🚀 Boost d'annonces (Standard, Premium, Super)
- 📊 Statistiques détaillées
- 💰 Gestion du compte

### Administrateurs
- 🛡️ Modération des annonces
- 👥 Gestion des utilisateurs
- 💰 Gestion des crédits
- 📈 Analytics avancés
- ⚙️ Configuration plateforme

## 🛠️ Technologies

- **React 18.3.1** + **TypeScript**
- **Tailwind CSS v4** - Styling moderne
- **Motion** - Animations fluides
- **React Router DOM 7** - Navigation
- **Recharts** - Graphiques et analytics
- **Vite 6** - Build ultra-rapide
- **Radix UI** - Composants accessibles

## 🎨 Design System

**Palette de couleurs** :
- `#0F172A` - Bleu foncé (titres, headers)
- `#FACC15` - Jaune/Or (CTA, accents)
- `#F3F4F6` - Gris clair (fonds)

**Polices** :
- **Inter** - Corps de texte
- **Poppins** - Titres
- **Sora** - Accents

## 🚀 Démarrage

```bash
# Installer pnpm (si nécessaire)
npm install -g pnpm

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm run dev

# Build pour production
pnpm run build
```

Le site sera accessible sur **http://localhost:5173/**

## 📱 Mobile Money

Opérateurs supportés :
- 🟠 Orange Money (frais 1%)
- 🔵 MTN Mobile Money (frais 1%)
- 🟢 Moov Money (frais 1%)
- 🟡 Wave (frais 0%)

## 💰 Système de crédits

**Tarif** : 1 crédit = 1000 FCFA

**Coûts** :
- Publication annonce : 1 crédit
- Boost Standard (7j) : 5 crédits
- Boost Premium (14j) : 10 crédits
- Super Boost (30j) : 20 crédits

## 🗂️ Structure

```
/src/app/
├── components/        # Composants réutilisables
│   ├── dashboard/    # Composants dashboard
│   └── ui/           # Bibliothèque UI (shadcn)
├── pages/            # Pages principales
│   └── dashboard/    # Pages dashboard (vendeur & admin)
├── data/             # Données mock
└── styles/           # Styles globaux
```

## 🌐 Routes

**Publiques** :
- `/` - Accueil
- `/annonces` - Liste des annonces
- `/annonces/:id` - Détail annonce
- `/publier` - Créer une annonce

**Authentification** :
- `/connexion` - Connexion
- `/inscription` - Inscription

**Dashboard Vendeur** :
- `/dashboard/vendeur` - Vue d'ensemble
- `/dashboard/vendeur/annonces` - Mes annonces
- `/dashboard/vendeur/recharge` - Recharge Mobile Money
- `/dashboard/vendeur/booster` - Booster annonces
- `/dashboard/vendeur/stats` - Statistiques

**Dashboard Admin** :
- `/dashboard/admin` - Vue d'ensemble
- `/dashboard/admin/moderation` - Modération
- `/dashboard/admin/users` - Utilisateurs
- `/dashboard/admin/credits` - Crédits
- `/dashboard/admin/payments` - Paiements
- `/dashboard/admin/analytics` - Analytics

## 📚 Documentation

- **ARCHITECTURE.md** - Architecture détaillée
- **POUR_CURSOR_AI.md** - Guide Cursor AI
- **CURSOR_AI_GUIDE.md** - Guide complet Cursor
- **CURSOR_PROMPTS.md** - Exemples de prompts

## 🔧 Scripts

```bash
pnpm run dev      # Serveur développement
pnpm run build    # Build production
pnpm run preview  # Preview production
```

## 📄 Licence

© 2024 AnnonceAuto.ci - Tous droits réservés

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**
