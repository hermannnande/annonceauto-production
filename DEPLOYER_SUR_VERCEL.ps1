# Script de déploiement automatique vers GitHub et Vercel
# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""


# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""






# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""


# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""






# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""


# AnnonceAuto.ci

Write-Host "🚀 Déploiement AnnonceAuto.ci" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git n'est pas installé. Installez Git depuis https://git-scm.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git détecté" -ForegroundColor Green
Write-Host ""

# Demander le nom du repository
Write-Host "📝 Nom du repository GitHub (ex: annonceauto-ci):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "annonceauto-ci"
    Write-Host "→ Utilisation du nom par défaut: $repoName" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📝 Votre nom d'utilisateur GitHub:" -ForegroundColor Yellow
$githubUsername = Read-Host

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Nom d'utilisateur GitHub requis" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "URL: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Initialiser Git si nécessaire
$gitExists = Test-Path ".git"
if (-not $gitExists) {
    Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

Write-Host ""

# Ajouter tous les fichiers
Write-Host "📦 Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Créer le commit
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
$commitMessage = "🚀 Déploiement AnnonceAuto.ci - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
git commit -m $commitMessage

Write-Host "✅ Commit créé: $commitMessage" -ForegroundColor Green
Write-Host ""

# Configurer le remote
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "🔗 Configuration du remote..." -ForegroundColor Yellow

$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    git remote set-url origin $remoteUrl
    Write-Host "✅ Remote mis à jour" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote ajouté" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Créez le repository sur GitHub" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://github.com/new" -ForegroundColor White
Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
Write-Host "3. Type: Public ou Private" -ForegroundColor White
Write-Host "4. NE PAS initialiser avec README/gitignore/licence" -ForegroundColor Red
Write-Host "5. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow

# Push vers GitHub
$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du push. Tentative avec force..." -ForegroundColor Yellow
    git push -u origin main --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code poussé sur GitHub avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec du push. Vérifiez vos identifiants GitHub" -ForegroundColor Red
        Write-Host "Erreur: $pushResult" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 CODE SUR GITHUB!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre repository: https://github.com/$githubUsername/$repoName" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "ÉTAPE SUIVANTE: Déployer sur Vercel" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Allez sur: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Connectez votre compte GitHub" -ForegroundColor White
Write-Host "3. Importez le repository: $githubUsername/$repoName" -ForegroundColor White
Write-Host "4. Framework Preset: Vite" -ForegroundColor White
Write-Host "5. Build Command: pnpm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Le déploiement prend 2-3 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ TERMINÉ!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre site sera disponible sur:" -ForegroundColor White
Write-Host "→ https://$repoName.vercel.app" -ForegroundColor Cyan
Write-Host "→ Ou un nom personnalisé si configuré" -ForegroundColor Gray
Write-Host ""







