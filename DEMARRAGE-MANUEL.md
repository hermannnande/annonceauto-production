# ⚡ GUIDE DE DÉMARRAGE RAPIDE - PAYFONTE

## ✅ FICHIERS .ENV CRÉÉS AUTOMATIQUEMENT

Les fichiers suivants ont été créés automatiquement :
- ✅ `backend/.env` (configuration backend)
- ✅ `.env.local` (configuration frontend)

---

## 🚀 DÉMARRAGE MANUEL (2 TERMINAUX)

### **Terminal 1 - Backend Express**

```cmd
cd backend
node server.clean.js
```

Vous devriez voir :
```
Server running on port 5000
```

### **Terminal 2 - Frontend Vite**

```cmd
pnpm dev
```

Vous devriez voir :
```
VITE v... ready in ...ms
➜  Local:   http://localhost:5173/
```

---

## ⚙️ CONFIGURATION DB REQUISE

### **IMPORTANT : Modifier le mot de passe PostgreSQL**

Ouvrez `backend/.env` et modifiez cette ligne :

```env
DB_PASSWORD=your_password_here
```

Remplacez par votre VRAI mot de passe PostgreSQL.

---

## 🗄️ MIGRATION SQL

Exécutez ce script dans votre base de données PostgreSQL :

```sql
-- Fichier: backend/database-migration-payfonte.sql
```

Cela ajoute les colonnes nécessaires pour Payfonte (`payfonte_reference`, `credits`, etc.)

---

## 🧪 TESTER LE SYSTÈME

### **1. Vérifier le backend**
Ouvrez dans votre navigateur :
```
http://localhost:5000/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2025-12-24T..."
}
```

### **2. Vérifier le frontend**
```
http://localhost:5173
```

### **3. Tester Payfonte**
- **Recharge** : http://localhost:5173/dashboard/vendeur/recharge
- **Booster** : http://localhost:5173/dashboard/vendeur/booster

---

## ❌ EN CAS D'ERREUR

### **Erreur : "Cannot connect to database"**
- ✅ Vérifiez que PostgreSQL est démarré
- ✅ Vérifiez `DB_PASSWORD` dans `backend/.env`
- ✅ Vérifiez que la DB `annonceauto` existe

### **Erreur : "Port 5000 already in use"**
- ✅ Tuez le processus sur le port 5000 :
  ```cmd
  netstat -ano | findstr :5000
  taskkill /PID [PID] /F
  ```

### **Erreur : "CORS policy"**
- ✅ Vérifiez que le backend est démarré
- ✅ Vérifiez que `.env.local` contient :
  ```env
  VITE_API_URL=http://localhost:5000
  ```

---

## 📋 CHECKLIST

- [ ] PostgreSQL démarré et accessible
- [ ] `backend/.env` créé et `DB_PASSWORD` modifié
- [ ] Migration SQL exécutée (`database-migration-payfonte.sql`)
- [ ] Backend démarré sur port 5000
- [ ] Frontend démarré sur port 5173
- [ ] Test : http://localhost:5000/health fonctionne

---

## ✅ TOUT EST PRÊT ?

Testez maintenant les pages Payfonte :
1. Connectez-vous sur http://localhost:5173
2. Allez sur "Recharger mon compte"
3. Sélectionnez un montant et cliquez sur "Payer avec Payfonte"

🎉 **Si ça marche, félicitations !** 🎉

Si ça ne marche pas, vérifiez la console du navigateur (F12) et les logs du backend.




