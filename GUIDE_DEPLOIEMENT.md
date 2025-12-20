# 🚀 Guide de Déploiement - AnnonceAuto.ci

## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit)
- ✅ Git installé sur votre ordinateur

---

## 🎯 Option 1 : Déploiement Automatique (Recommandé)

### Étape unique : Lancer le script

```powershell
.\DEPLOYER_SUR_VERCEL.ps1
```

Le script va :
1. ✅ Vérifier Git
2. ✅ Créer les commits
3. ✅ Vous guider pour créer le repository GitHub
4. ✅ Pousser le code
5. ✅ Vous donner les instructions Vercel

---

## 🛠️ Option 2 : Déploiement Manuel

### 1️⃣ Créer le repository GitHub

**A. Sur GitHub.com** :

1. Allez sur https://github.com/new
2. Nom du repository : `annonceauto-ci` (ou autre)
3. Type : **Public** ou **Private**
4. ❌ **NE PAS** initialiser avec README/gitignore/licence
5. Cliquez sur **"Create repository"**

**B. Dans votre terminal** :

```powershell
# Naviguer vers le projet
cd "C:\Users\nande\Desktop\Site Annonces Véhicules (2)"

# Initialiser Git (si pas déjà fait)
git init
git branch -M main

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "🚀 Premier déploiement AnnonceAuto.ci"

# Ajouter le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/annonceauto-ci.git

# Pousser le code
git push -u origin main
```

---

### 2️⃣ Déployer sur Vercel

**A. Connecter GitHub à Vercel** :

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

**B. Importer le projet** :

1. Cliquez sur **"Add New Project"**
2. Sélectionnez **"Import Git Repository"**
3. Trouvez votre repository `annonceauto-ci`
4. Cliquez sur **"Import"**

**C. Configuration du déploiement** :

```yaml
Framework Preset: Vite
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

**D. Variables d'environnement (optionnel)** :

Aucune variable requise pour le moment.

**E. Lancer le déploiement** :

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes ⏱️
3. ✅ C'est en ligne ! 🎉

---

## 🌐 Votre site est en ligne !

Vercel vous donnera une URL du type :
```
https://annonceauto-ci.vercel.app
```

Ou avec votre username :
```
https://annonceauto-ci-username.vercel.app
```

---

## 🔄 Mises à jour automatiques

Chaque fois que vous poussez du code sur GitHub :
```powershell
git add .
git commit -m "🔧 Amélioration XYZ"
git push
```

Vercel **redéploie automatiquement** en 2-3 minutes ! 🚀

---

## 🎨 Domaine personnalisé (optionnel)

### Ajouter votre propre domaine :

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `annonceauto.ci`)
3. Configurez les DNS selon les instructions
4. Attendez la propagation (5 min - 24h)

### Exemple de configuration DNS :

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## ⚙️ Configuration Vercel avancée

### Performance :

```json
// vercel.json (déjà créé)
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Headers de cache :

Les assets (images, CSS, JS) sont cachés automatiquement.

---

## 🐛 Résolution de problèmes

### Erreur : "Build failed"

**Solution** :
1. Vérifiez les logs de build sur Vercel
2. Testez localement : `pnpm run build`
3. Vérifiez que `dist/` contient bien les fichiers

### Erreur : "404 Not Found" sur les routes

**Solution** : Le fichier `vercel.json` gère déjà les rewrites. Si problème :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Erreur : "Module not found"

**Solution** :
1. Vérifiez `package.json`
2. Sur Vercel, dans Settings → General
3. Changez Node.js Version → 18.x ou 20.x

### Le site ne se met pas à jour

**Solution** :
1. Allez dans Vercel → Deployments
2. Cliquez sur le dernier déploiement
3. Vérifiez qu'il est bien en "Ready"
4. Videz le cache du navigateur (Ctrl + F5)

---

## 📊 Monitoring

### Analytics Vercel :

1. Dans Vercel → Analytics
2. Activez Web Analytics (gratuit)
3. Voyez le trafic en temps réel

### Logs :

1. Vercel → Project → Deployments
2. Cliquez sur un déploiement
3. Onglet "Logs" pour les erreurs

---

## 🔒 Sécurité

### Protection de branche sur GitHub :

1. GitHub → Settings → Branches
2. Add branch protection rule
3. Branch name : `main`
4. ✅ Require pull request reviews

### Variables secrètes :

1. Vercel → Settings → Environment Variables
2. Ajoutez vos API keys (Mobile Money, etc.)
3. Type : Encrypted

---

## 💰 Coûts

### Gratuit pour toujours :
- ✅ Déploiements illimités
- ✅ HTTPS automatique
- ✅ CDN mondial
- ✅ 100 GB de bande passante/mois

### Pro (si besoin) :
- $20/mois par utilisateur
- Analytics avancés
- Plus de bande passante

Pour ce projet, **le plan gratuit suffit** ! 🎉

---

## 🎯 Checklist finale

Avant de déployer en production :

- [ ] ✅ `.gitignore` créé
- [ ] ✅ `vercel.json` créé
- [ ] ✅ `README.md` à jour
- [ ] ✅ Build local réussit : `pnpm run build`
- [ ] ✅ Code sur GitHub
- [ ] ✅ Projet importé sur Vercel
- [ ] ✅ Premier déploiement réussi
- [ ] ✅ Site accessible en ligne
- [ ] 🔄 Backend à connecter (plus tard)
- [ ] 🔄 Domaine personnalisé (optionnel)

---

## 🆘 Support

### Documentation officielle :
- Vercel : https://vercel.com/docs
- Vite : https://vitejs.dev/guide/
- React Router : https://reactrouter.com/

### Communauté :
- Discord Vercel
- GitHub Issues
- Stack Overflow

---

## 🎉 Félicitations !

Votre site **AnnonceAuto.ci** est maintenant en ligne ! 🚀

Partagez l'URL avec vos amis, clients, investisseurs !

**Prochaines étapes** :
1. 🔧 Connecter un backend (Node.js + PostgreSQL)
2. 💳 Intégrer les API Mobile Money
3. 📧 Configurer les emails (SendGrid, etc.)
4. 📱 Créer l'app mobile (React Native)
5. 🎨 Améliorer le design selon les retours

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**



## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit)
- ✅ Git installé sur votre ordinateur

---

## 🎯 Option 1 : Déploiement Automatique (Recommandé)

### Étape unique : Lancer le script

```powershell
.\DEPLOYER_SUR_VERCEL.ps1
```

Le script va :
1. ✅ Vérifier Git
2. ✅ Créer les commits
3. ✅ Vous guider pour créer le repository GitHub
4. ✅ Pousser le code
5. ✅ Vous donner les instructions Vercel

---

## 🛠️ Option 2 : Déploiement Manuel

### 1️⃣ Créer le repository GitHub

**A. Sur GitHub.com** :

1. Allez sur https://github.com/new
2. Nom du repository : `annonceauto-ci` (ou autre)
3. Type : **Public** ou **Private**
4. ❌ **NE PAS** initialiser avec README/gitignore/licence
5. Cliquez sur **"Create repository"**

**B. Dans votre terminal** :

```powershell
# Naviguer vers le projet
cd "C:\Users\nande\Desktop\Site Annonces Véhicules (2)"

# Initialiser Git (si pas déjà fait)
git init
git branch -M main

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "🚀 Premier déploiement AnnonceAuto.ci"

# Ajouter le remote (remplacez VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/annonceauto-ci.git

# Pousser le code
git push -u origin main
```

---

### 2️⃣ Déployer sur Vercel

**A. Connecter GitHub à Vercel** :

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

**B. Importer le projet** :

1. Cliquez sur **"Add New Project"**
2. Sélectionnez **"Import Git Repository"**
3. Trouvez votre repository `annonceauto-ci`
4. Cliquez sur **"Import"**

**C. Configuration du déploiement** :

```yaml
Framework Preset: Vite
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

**D. Variables d'environnement (optionnel)** :

Aucune variable requise pour le moment.

**E. Lancer le déploiement** :

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes ⏱️
3. ✅ C'est en ligne ! 🎉

---

## 🌐 Votre site est en ligne !

Vercel vous donnera une URL du type :
```
https://annonceauto-ci.vercel.app
```

Ou avec votre username :
```
https://annonceauto-ci-username.vercel.app
```

---

## 🔄 Mises à jour automatiques

Chaque fois que vous poussez du code sur GitHub :
```powershell
git add .
git commit -m "🔧 Amélioration XYZ"
git push
```

Vercel **redéploie automatiquement** en 2-3 minutes ! 🚀

---

## 🎨 Domaine personnalisé (optionnel)

### Ajouter votre propre domaine :

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `annonceauto.ci`)
3. Configurez les DNS selon les instructions
4. Attendez la propagation (5 min - 24h)

### Exemple de configuration DNS :

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## ⚙️ Configuration Vercel avancée

### Performance :

```json
// vercel.json (déjà créé)
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Headers de cache :

Les assets (images, CSS, JS) sont cachés automatiquement.

---

## 🐛 Résolution de problèmes

### Erreur : "Build failed"

**Solution** :
1. Vérifiez les logs de build sur Vercel
2. Testez localement : `pnpm run build`
3. Vérifiez que `dist/` contient bien les fichiers

### Erreur : "404 Not Found" sur les routes

**Solution** : Le fichier `vercel.json` gère déjà les rewrites. Si problème :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Erreur : "Module not found"

**Solution** :
1. Vérifiez `package.json`
2. Sur Vercel, dans Settings → General
3. Changez Node.js Version → 18.x ou 20.x

### Le site ne se met pas à jour

**Solution** :
1. Allez dans Vercel → Deployments
2. Cliquez sur le dernier déploiement
3. Vérifiez qu'il est bien en "Ready"
4. Videz le cache du navigateur (Ctrl + F5)

---

## 📊 Monitoring

### Analytics Vercel :

1. Dans Vercel → Analytics
2. Activez Web Analytics (gratuit)
3. Voyez le trafic en temps réel

### Logs :

1. Vercel → Project → Deployments
2. Cliquez sur un déploiement
3. Onglet "Logs" pour les erreurs

---

## 🔒 Sécurité

### Protection de branche sur GitHub :

1. GitHub → Settings → Branches
2. Add branch protection rule
3. Branch name : `main`
4. ✅ Require pull request reviews

### Variables secrètes :

1. Vercel → Settings → Environment Variables
2. Ajoutez vos API keys (Mobile Money, etc.)
3. Type : Encrypted

---

## 💰 Coûts

### Gratuit pour toujours :
- ✅ Déploiements illimités
- ✅ HTTPS automatique
- ✅ CDN mondial
- ✅ 100 GB de bande passante/mois

### Pro (si besoin) :
- $20/mois par utilisateur
- Analytics avancés
- Plus de bande passante

Pour ce projet, **le plan gratuit suffit** ! 🎉

---

## 🎯 Checklist finale

Avant de déployer en production :

- [ ] ✅ `.gitignore` créé
- [ ] ✅ `vercel.json` créé
- [ ] ✅ `README.md` à jour
- [ ] ✅ Build local réussit : `pnpm run build`
- [ ] ✅ Code sur GitHub
- [ ] ✅ Projet importé sur Vercel
- [ ] ✅ Premier déploiement réussi
- [ ] ✅ Site accessible en ligne
- [ ] 🔄 Backend à connecter (plus tard)
- [ ] 🔄 Domaine personnalisé (optionnel)

---

## 🆘 Support

### Documentation officielle :
- Vercel : https://vercel.com/docs
- Vite : https://vitejs.dev/guide/
- React Router : https://reactrouter.com/

### Communauté :
- Discord Vercel
- GitHub Issues
- Stack Overflow

---

## 🎉 Félicitations !

Votre site **AnnonceAuto.ci** est maintenant en ligne ! 🚀

Partagez l'URL avec vos amis, clients, investisseurs !

**Prochaines étapes** :
1. 🔧 Connecter un backend (Node.js + PostgreSQL)
2. 💳 Intégrer les API Mobile Money
3. 📧 Configurer les emails (SendGrid, etc.)
4. 📱 Créer l'app mobile (React Native)
5. 🎨 Améliorer le design selon les retours

---

**Fait avec ❤️ pour la Côte d'Ivoire 🇨🇮**






