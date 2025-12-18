# ⚡ Démarrage Rapide - AnnonceAuto.ci

Guide ultra-rapide pour lancer le site en 5 minutes.

## 🚀 Installation en 3 étapes

### 1️⃣ Vérifier Node.js

```bash
node --version
```

Si version < 18, télécharger : https://nodejs.org/

### 2️⃣ Installer pnpm

```bash
npm install -g pnpm
```

### 3️⃣ Installer et lancer

```bash
# Installer les dépendances (2-5 min)
pnpm install

# Lancer le serveur
pnpm run dev
```

## 🌐 Ouvrir dans le navigateur

http://localhost:5173

## ✅ C'est tout !

Le site devrait maintenant fonctionner.

## 📱 Pages à tester

- **/** - Page d'accueil
- **/annonces** - Liste des annonces
- **/publier** - Publier une annonce
- **/connexion** - Se connecter
- **/dashboard/vendeur** - Dashboard vendeur
- **/dashboard/admin** - Dashboard admin

## 🛠️ Commandes utiles

```bash
# Lancer en développement
pnpm run dev

# Arrêter (dans le terminal)
Ctrl + C

# Build pour production
pnpm run build

# Tester sur mobile (même Wi-Fi)
pnpm run dev -- --host
# Puis ouvrir : http://[VOTRE_IP]:5173
```

## 🐛 Problème ?

### "Port 5173 déjà utilisé"
```bash
pnpm run dev -- --port 3000
```

### Erreurs d'installation
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Page blanche
1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. Rafraîchir (Ctrl+R)

## 📚 Documentation complète

- **Installation détaillée** : [INSTALLATION_LOCALE.md](./INSTALLATION_LOCALE.md)
- **Architecture** : [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Guide développeur** : [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

## 🎯 Prochaines étapes

1. ✅ Explorer toutes les pages
2. ✅ Tester les dashboards
3. ✅ Lire [ARCHITECTURE.md](./ARCHITECTURE.md)
4. ✅ Commencer à développer

**Bon développement ! 🚗💨**
