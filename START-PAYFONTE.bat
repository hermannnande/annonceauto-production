@echo off
chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════
echo    🚀 DÉMARRAGE ANNONCEAUTO.CI + PAYFONTE
echo ════════════════════════════════════════════════════════════
echo.

REM ==========================================
REM ÉTAPE 1: Créer backend/.env si manquant
REM ==========================================
echo 📋 Vérification de backend\.env...

if not exist "backend\.env" (
    echo ❌ Fichier backend\.env manquant !
    echo    Création automatique...
    (
        echo # CONFIGURATION BACKEND ANNONCEAUTO.CI
        echo NODE_ENV=development
        echo PORT=5000
        echo BACKEND_URL=http://localhost:5000
        echo.
        echo # DATABASE
        echo DB_HOST=localhost
        echo DB_PORT=5432
        echo DB_NAME=annonceauto
        echo DB_USER=postgres
        echo DB_PASSWORD=your_password_here
        echo.
        echo # JWT
        echo JWT_SECRET=dev_secret_key_change_in_production_12345
        echo.
        echo # PAYFONTE
        echo PAYFONTE_CLIENT_ID=obrille
        echo PAYFONTE_CLIENT_SECRET=live_6884f04fce3ec3bb73bd6ea0f87e4b41e95f420e3f29108d78
        echo PAYFONTE_ENV=production
        echo.
        echo # FRONTEND URL
        echo SITE_URL=http://localhost:5173
        echo.
        echo # UPLOAD
        echo UPLOAD_DIR=./uploads
        echo MAX_FILE_SIZE=5242880
    ) > "backend\.env"
    
    echo ✅ backend\.env créé !
    echo.
    echo ⚠️  IMPORTANT: Modifiez DB_PASSWORD dans backend\.env !
    pause
) else (
    echo ✅ backend\.env trouvé
)

REM ==========================================
REM ÉTAPE 2: Créer .env.local si manquant
REM ==========================================
echo.
echo 📋 Vérification de .env.local...

if not exist ".env.local" (
    echo ❌ Fichier .env.local manquant !
    echo    Création automatique...
    (
        echo # FRONTEND CONFIGURATION
        echo VITE_API_URL=http://localhost:5000
        echo.
        echo # Supabase
        echo VITE_SUPABASE_URL=https://vnhwllsawfaueivykhly.supabase.co
        echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaHdsbHNhd2ZhdWVpdnlraGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzczMTgsImV4cCI6MjA4MjAxMzMxOH0.W4td5ZTiGYxqutPAyGGcGpkRNlXW1PJfQ5JCb-BZt64
    ) > ".env.local"
    
    echo ✅ .env.local créé !
) else (
    echo ✅ .env.local trouvé
)

REM ==========================================
REM ÉTAPE 3: Démarrer le backend
REM ==========================================
echo.
echo 📋 Démarrage du backend Express...
start "Backend AnnonceAuto.ci" cmd /k "cd /d %~dp0backend && echo 🟢 BACKEND EN COURS... && node server.clean.js"
timeout /t 3 >nul

REM ==========================================
REM ÉTAPE 4: Démarrer le frontend
REM ==========================================
echo ✅ Backend démarré
echo.
echo 📋 Démarrage du frontend Vite...
start "Frontend AnnonceAuto.ci" cmd /k "cd /d %~dp0 && echo 🟢 FRONTEND EN COURS... && pnpm dev"
timeout /t 3 >nul

REM ==========================================
REM RÉCAPITULATIF
REM ==========================================
echo ✅ Frontend démarré
echo.
echo ════════════════════════════════════════════════════════════
echo           ✅ SYSTÈME DÉMARRÉ !
echo ════════════════════════════════════════════════════════════
echo.
echo 📍 URLs importantes:
echo    🔹 Frontend:  http://localhost:5173
echo    🔹 Backend:   http://localhost:5000
echo    🔹 API Test:  http://localhost:5000/health
echo.
echo 📂 Pages Payfonte à tester:
echo    🔹 Recharge:  http://localhost:5173/dashboard/vendeur/recharge
echo    🔹 Booster:   http://localhost:5173/dashboard/vendeur/booster
echo.
echo ⚠️  IMPORTANT:
echo    • Le backend DOIT avoir une connexion PostgreSQL valide
echo    • Modifiez backend\.env avec votre mot de passe PostgreSQL
echo    • Exécutez database-migration-payfonte.sql dans votre DB
echo.
echo 🛑 Pour arrêter: Fermez les fenêtres Backend et Frontend
echo.
echo ✨ Bon développement ! ✨
echo.
pause




