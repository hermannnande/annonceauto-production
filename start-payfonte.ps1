# ==========================================
# 🚀 Script de démarrage COMPLET Payfonte
# ==========================================

Write-Host "`n╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 DÉMARRAGE ANNONCEAUTO.CI + PAYFONTE   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ==========================================
# ÉTAPE 1: Vérifier le backend .env
# ==========================================
Write-Host "📋 Étape 1: Vérification de backend/.env..." -ForegroundColor Yellow

if (!(Test-Path "backend\.env")) {
    Write-Host "❌ Fichier backend\.env manquant !" -ForegroundColor Red
    Write-Host "   Création automatique avec valeurs par défaut..." -ForegroundColor Yellow
    
    @"
# =====================================================
# CONFIGURATION BACKEND ANNONCEAUTO.CI
# =====================================================

# SERVEUR
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000

# DATABASE (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=annonceauto
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT (Authentification)
JWT_SECRET=dev_secret_key_change_in_production_12345

# PAYFONTE (Paiements)
PAYFONTE_CLIENT_ID=obrille
PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
PAYFONTE_ENV=production

# FRONTEND URL
SITE_URL=http://localhost:5173

# UPLOAD / STORAGE
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    
    Write-Host "✅ Fichier backend\.env créé !" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Modifiez DB_PASSWORD avec votre mot de passe PostgreSQL !" -ForegroundColor Red
    Write-Host "   Fichier: backend\.env" -ForegroundColor Yellow
    Read-Host "`nAppuyez sur Entrée après avoir modifié le mot de passe"
} else {
    Write-Host "✅ backend\.env trouvé" -ForegroundColor Green
}

# ==========================================
# ÉTAPE 2: Vérifier le frontend .env.local
# ==========================================
Write-Host "`n📋 Étape 2: Vérification de .env.local (frontend)..." -ForegroundColor Yellow

if (!(Test-Path ".env.local")) {
    Write-Host "❌ Fichier .env.local manquant !" -ForegroundColor Red
    Write-Host "   Création automatique..." -ForegroundColor Yellow
    
    @"
# =====================================================
# FRONTEND - ANNONCEAUTO.CI
# =====================================================

# URL du backend Express local
VITE_API_URL=http://localhost:5000

# Supabase (pour authentification uniquement si nécessaire)
VITE_SUPABASE_URL=https://vnhwllsawfaueivykhly.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaHdsbHNhd2ZhdWVpdnlraGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzczMTgsImV4cCI6MjA4MjAxMzMxOH0.W4td5ZTiGYxqutPAyGGcGpkRNlXW1PJfQ5JCb-BZt64
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Fichier .env.local créé !" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local trouvé" -ForegroundColor Green
}

# ==========================================
# ÉTAPE 3: Démarrer le backend
# ==========================================
Write-Host "`n📋 Étape 3: Démarrage du backend Express..." -ForegroundColor Yellow

$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '🟢 BACKEND EN COURS...' -ForegroundColor Green; node server.clean.js" -PassThru -WindowStyle Normal

if ($backendProcess) {
    Write-Host "✅ Backend démarré sur http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "❌ Échec du démarrage du backend" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3

# ==========================================
# ÉTAPE 4: Démarrer le frontend
# ==========================================
Write-Host "`n📋 Étape 4: Démarrage du frontend Vite..." -ForegroundColor Yellow

$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🟢 FRONTEND EN COURS...' -ForegroundColor Green; pnpm dev" -PassThru -WindowStyle Normal

if ($frontendProcess) {
    Write-Host "✅ Frontend démarré" -ForegroundColor Green
} else {
    Write-Host "❌ Échec du démarrage du frontend" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3

# ==========================================
# RÉCAPITULATIF
# ==========================================
Write-Host "`n╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✅ SYSTÈME DÉMARRÉ !                ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📍 URLs importantes:" -ForegroundColor Cyan
Write-Host "   🔹 Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   🔹 Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   🔹 API Test:  http://localhost:5000/health" -ForegroundColor White

Write-Host "`n📂 Pages Payfonte à tester:" -ForegroundColor Cyan
Write-Host "   🔹 Recharge:  http://localhost:5173/dashboard/vendeur/recharge" -ForegroundColor White
Write-Host "   🔹 Booster:   http://localhost:5173/dashboard/vendeur/booster" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   • Le backend DOIT avoir une connexion PostgreSQL valide" -ForegroundColor White
Write-Host "   • Modifiez backend\.env avec votre mot de passe PostgreSQL" -ForegroundColor White
Write-Host "   • Exécutez database-migration-payfonte.sql dans votre DB" -ForegroundColor White

Write-Host "`n🛑 Pour arrêter les serveurs:" -ForegroundColor Red
Write-Host "   • Fermez les fenêtres PowerShell ou appuyez sur Ctrl+C" -ForegroundColor White

Write-Host "`n✨ Bon développement ! ✨`n" -ForegroundColor Cyan


Write-Host "   • Modifiez backend\.env avec votre mot de passe PostgreSQL" -ForegroundColor White
Write-Host "   • Exécutez database-migration-payfonte.sql dans votre DB" -ForegroundColor White

Write-Host "`n🛑 Pour arrêter les serveurs:" -ForegroundColor Red
Write-Host "   • Fermez les fenêtres PowerShell ou appuyez sur Ctrl+C" -ForegroundColor White

Write-Host "`n✨ Bon développement ! ✨`n" -ForegroundColor Cyan


Write-Host "   • Modifiez backend\.env avec votre mot de passe PostgreSQL" -ForegroundColor White
Write-Host "   • Exécutez database-migration-payfonte.sql dans votre DB" -ForegroundColor White

Write-Host "`n🛑 Pour arrêter les serveurs:" -ForegroundColor Red
Write-Host "   • Fermez les fenêtres PowerShell ou appuyez sur Ctrl+C" -ForegroundColor White

Write-Host "`n✨ Bon développement ! ✨`n" -ForegroundColor Cyan

# Script de démarrage complet - AnnonceAuto.ci avec Payfonte
# =====================================================

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   AnnonceAuto.ci - Démarrage avec Payfonte   " -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que les fichiers .env existent
Write-Host "[1/5] Vérification des fichiers de configuration..." -ForegroundColor Green

$frontendEnv = Test-Path ".env.local"
$backendEnv = Test-Path "backend/.env"

if (-not $frontendEnv) {
    Write-Host "❌ ERREUR: Fichier .env.local introuvable à la racine du projet!" -ForegroundColor Red
    Write-Host "📝 Créez-le avec:" -ForegroundColor Yellow
    Write-Host "   ni .env.local" -ForegroundColor White
    Write-Host "   Puis copiez le contenu depuis PAYFONTE_KEYS_CONFIGURATION.md" -ForegroundColor White
    exit 1
}

if (-not $backendEnv) {
    Write-Host "❌ ERREUR: Fichier backend/.env introuvable!" -ForegroundColor Red
    Write-Host "📝 Créez-le avec:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   ni .env" -ForegroundColor White
    Write-Host "   Puis copiez le contenu depuis backend/ENV_BACKEND_TEMPLATE.txt" -ForegroundColor White
    exit 1
}

Write-Host "✅ Fichiers de configuration trouvés!" -ForegroundColor Green
Write-Host ""

# Vérifier les dépendances
Write-Host "[2/5] Vérification des dépendances..." -ForegroundColor Green

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERREUR: pnpm n'est pas installé!" -ForegroundColor Red
    Write-Host "📝 Installez-le avec: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    pnpm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

Write-Host "✅ Dépendances installées!" -ForegroundColor Green
Write-Host ""

# Vérifier si le serveur backend utilise le bon fichier
Write-Host "[3/5] Vérification du serveur backend..." -ForegroundColor Green

if (Test-Path "backend/server.clean.js") {
    Write-Host "⚠️  Fichier server.clean.js trouvé!" -ForegroundColor Yellow
    Write-Host "   Il faut renommer server.clean.js en server.js pour utiliser la nouvelle version avec Payfonte" -ForegroundColor Yellow
    
    $response = Read-Host "Voulez-vous faire la mise à jour maintenant? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        if (Test-Path "backend/server.js") {
            Move-Item -Path "backend/server.js" -Destination "backend/server.js.old" -Force
            Write-Host "   ✅ Ancien server.js sauvegardé en server.js.old" -ForegroundColor Green
        }
        Move-Item -Path "backend/server.clean.js" -Destination "backend/server.js" -Force
        Write-Host "   ✅ server.clean.js renommé en server.js" -ForegroundColor Green
    }
}

Write-Host "✅ Serveur backend prêt!" -ForegroundColor Green
Write-Host ""

# Afficher les informations de configuration
Write-Host "[4/5] Configuration Payfonte..." -ForegroundColor Green

$envContent = Get-Content "backend/.env" -Raw
if ($envContent -match "PAYFONTE_CLIENT_ID=(.+)") {
    $clientId = $matches[1].Trim()
    Write-Host "   Client ID: $clientId" -ForegroundColor White
}

if ($envContent -match "PAYFONTE_ENV=(.+)") {
    $payfonteEnv = $matches[1].Trim()
    Write-Host "   Mode: $payfonteEnv" -ForegroundColor White
    
    if ($payfonteEnv -eq "production") {
        Write-Host "   ⚠️  MODE PRODUCTION - Les paiements sont RÉELS!" -ForegroundColor Red
    } else {
        Write-Host "   ℹ️  Mode Sandbox - Paiements de test" -ForegroundColor Cyan
    }
}

Write-Host ""

# Démarrage des serveurs
Write-Host "[5/5] Démarrage des serveurs..." -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Démarrage du backend sur http://localhost:5000" -ForegroundColor Cyan
Write-Host "🚀 Démarrage du frontend sur http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour arrêter les serveurs, appuyez sur Ctrl+C dans chaque terminal" -ForegroundColor Yellow
Write-Host ""

# Démarrer le backend dans un nouveau terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend AnnonceAuto.ci' -ForegroundColor Cyan; npm start"

# Attendre 3 secondes que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend dans un nouveau terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '🎨 Frontend AnnonceAuto.ci' -ForegroundColor Cyan; pnpm dev"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   ✅ SERVEURS DÉMARRÉS AVEC SUCCÈS!         " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - PAYFONTE_INTEGRATION_COMPLETE.md" -ForegroundColor White
Write-Host "   - PAYFONTE_KEYS_CONFIGURATION.md" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Bon développement!" -ForegroundColor Green



