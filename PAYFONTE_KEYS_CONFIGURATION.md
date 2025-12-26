# 🔐 Configuration des Clés Payfonte - PRODUCTION

## ⚠️ ATTENTION SÉCURITÉ

**VOS CLÉS SONT EN MODE PRODUCTION (`live_`)** - Les paiements seront RÉELS !

Ces clés sont **EXTRÊMEMENT SENSIBLES** :
- ❌ **NE JAMAIS** les commiter dans Git
- ❌ **NE JAMAIS** les partager publiquement
- ❌ **NE JAMAIS** les mettre dans le code frontend
- ✅ **UNIQUEMENT** dans `.env.local` et Supabase Secrets

---

## 📝 ÉTAPE 1 : Créer votre `.env.local`

À la racine de votre projet (`C:\Users\nande\Downloads\Site Annonces Véhicules (3)\`), créez un fichier **`.env.local`** avec ce contenu :

```env
# =====================================================
# CONFIGURATION ANNONCEAUTO.CI - PRODUCTION
# =====================================================

# =====================================================
# SUPABASE
# =====================================================
VITE_SUPABASE_URL=https://vnhwllsawfaueivykhly.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaHdsbHNhd2ZhdWVpdnlraGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzczMTgsImV4cCI6MjA4MjAxMzMxOH0.W4td5ZTiGYxqutPAyGGcGpkRNlXW1PJfQ5JCb-BZt64

# =====================================================
# PAYFONTE (PRODUCTION - Clés réelles)
# =====================================================
VITE_PAYFONTE_CLIENT_ID=obrille
VITE_PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
VITE_PAYFONTE_ENV=production
VITE_PAYFONTE_WEBHOOK_URL=https://vnhwllsawfaueivykhly.supabase.co/functions/v1/payfonte-webhook

# =====================================================
# SITE
# =====================================================
VITE_SITE_URL=http://localhost:5173
```

---

## 🚀 ÉTAPE 2 : Déployer les Edge Functions sur Supabase

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
# 1. Lier le projet Supabase (si ce n'est pas déjà fait)
supabase link --project-ref vnhwllsawfaueivykhly

# 2. Déployer les 3 Edge Functions
supabase functions deploy payfonte-create-checkout
supabase functions deploy payfonte-verify-payment
supabase functions deploy payfonte-webhook

# 3. Configurer les secrets (BACKEND - SÉCURISÉ)
supabase secrets set PAYFONTE_CLIENT_ID=obrille
supabase secrets set PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
supabase secrets set PAYFONTE_ENV=production
```

---

## 🔗 ÉTAPE 3 : Configurer le Webhook dans Payfonte

1. Connectez-vous au **Dashboard Payfonte** : https://dashboard.payfonte.com/
2. Allez dans **Settings** → **Webhooks** (ou API Settings)
3. Ajoutez cette URL de webhook :

```
https://vnhwllsawfaueivykhly.supabase.co/functions/v1/payfonte-webhook
```

4. Sélectionnez les événements à écouter :
   - ✅ `checkout.successful`
   - ✅ `checkout.failed`
   - ✅ `checkout.cancelled` (optionnel)

5. **Enregistrez** la configuration

---

## 🔍 ÉTAPE 4 : Vérifier que tout fonctionne

### A. Vérifier le fichier `.env.local`

```powershell
# Dans PowerShell, à la racine du projet :
cat .env.local
```

Vous devriez voir vos clés Payfonte.

### B. Redémarrer le serveur de développement

```powershell
# Arrêter le serveur actuel (Ctrl+C)
# Puis relancer :
pnpm dev
```

### C. Vérifier que les Edge Functions sont déployées

```powershell
supabase functions list
```

Vous devriez voir :
- ✅ `payfonte-create-checkout`
- ✅ `payfonte-verify-payment`
- ✅ `payfonte-webhook`

### D. Tester un paiement

1. Connectez-vous à votre site
2. Allez sur **Dashboard Vendeur** → **Recharger mon compte**
3. Sélectionnez un montant (ex: 5,000 FCFA)
4. Cliquez sur **"Payer avec Payfonte"**
5. Vous serez redirigé vers la page de paiement Payfonte
6. **⚠️ ATTENTION** : Vous êtes en mode **PRODUCTION**, les paiements seront RÉELS !

---

## 🧪 Mode Test (Sandbox) - Recommandé pour les premiers tests

Si vous voulez tester SANS argent réel, demandez des clés **sandbox** à Payfonte :
- Client ID sandbox (commence souvent par `test_` ou autre)
- Client Secret sandbox (commence par `test_` au lieu de `live_`)

Puis dans `.env.local`, changez :

```env
VITE_PAYFONTE_ENV=sandbox
```

Et utilisez l'API sandbox : `https://sandbox-api.payfonte.com`

---

## 📊 Vérifier les paiements

### Dans Supabase (votre base de données)

1. Allez sur https://supabase.com/dashboard/project/vnhwllsawfaueivykhly
2. **Table Editor** → Table `credits_transactions`
3. Vous verrez tous les paiements enregistrés

### Dans le Dashboard Payfonte

1. https://dashboard.payfonte.com/
2. **Transactions** ou **Payments**
3. Vous verrez tous les paiements avec leur statut

---

## 🆘 Dépannage

### Problème : "Erreur lors de l'initiation du paiement"

✅ **Solution** : Vérifiez que :
1. Le fichier `.env.local` est à la racine du projet
2. Le serveur a été redémarré après la création du `.env.local`
3. Les clés sont correctement copiées (pas d'espace en trop)

### Problème : "Webhook non reçu"

✅ **Solution** : Vérifiez que :
1. Le webhook est configuré dans le dashboard Payfonte
2. L'URL du webhook est exacte
3. Les Edge Functions sont déployées (`supabase functions list`)

### Problème : "Les crédits ne sont pas ajoutés"

✅ **Solution** : Vérifiez dans :
1. Supabase → **Functions** → Logs du `payfonte-webhook`
2. Console du navigateur (F12) → Network → Recherchez les erreurs

---

## 📞 Support

Si vous avez des questions :
- **Documentation Payfonte** : https://docs.payfonte.com/
- **Support Payfonte** : support@payfonte.com
- **Logs Supabase** : https://supabase.com/dashboard/project/vnhwllsawfaueivykhly/functions

---

## ✅ Checklist finale

Avant de passer en production :

- [ ] `.env.local` créé avec les bonnes clés
- [ ] Les 3 Edge Functions déployées sur Supabase
- [ ] Secrets configurés dans Supabase (`supabase secrets list`)
- [ ] Webhook configuré dans le dashboard Payfonte
- [ ] Test d'un paiement réussi
- [ ] Vérification que les crédits sont ajoutés
- [ ] Test d'un paiement annulé (pour vérifier la gestion des erreurs)
- [ ] `.env.local` ajouté à `.gitignore`

---

## 🔒 RAPPEL SÉCURITÉ

**AVANT DE COMMITER SUR GIT** :

```powershell
# Vérifiez que .env.local est dans .gitignore
cat .gitignore | Select-String "\.env"
```

Si vous ne voyez pas `.env.local`, ajoutez-le dans `.gitignore` :

```
# .gitignore
.env
.env.local
.env*.local
```

**NE JAMAIS COMMITER VOS CLÉS !**




