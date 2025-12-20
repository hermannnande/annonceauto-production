-- ================================================
-- CORRECTION DU SCHÉMA SUPABASE
-- Pour correspondre au code backend
-- ================================================

-- Supprimer l'ancienne table users
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Créer la nouvelle table users avec les bonnes colonnes
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  role VARCHAR(20) DEFAULT 'vendeur' CHECK (role IN ('vendeur', 'admin')),
  credits INTEGER DEFAULT 0,
  avatar_url TEXT,
  ville VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  marque VARCHAR(100) NOT NULL,
  modele VARCHAR(100) NOT NULL,
  annee INTEGER NOT NULL,
  prix DECIMAL(12, 2) NOT NULL,
  kilometrage VARCHAR(50) NOT NULL,
  carburant VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  couleur VARCHAR(50),
  ville VARCHAR(100) NOT NULL,
  commune VARCHAR(100),
  images JSONB DEFAULT '[]',
  equipements JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete', 'vendu')),
  boost_level INTEGER DEFAULT 0,
  boost_expires_at TIMESTAMP,
  vues INTEGER DEFAULT 0,
  favoris INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table credits_history
CREATE TABLE credits_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('achat', 'utilisation', 'remboursement')),
  montant_fcfa DECIMAL(12, 2),
  credits INTEGER NOT NULL,
  description TEXT,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table payments
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  montant DECIMAL(12, 2) NOT NULL,
  credits INTEGER NOT NULL,
  methode VARCHAR(50) NOT NULL CHECK (methode IN ('orange', 'mtn', 'moov', 'wave')),
  telephone VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'reussi', 'echoue')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table boosts
CREATE TABLE boosts (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('standard', 'premium', 'super')),
  credits_utilises INTEGER NOT NULL,
  duree_jours INTEGER NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  sender_email VARCHAR(255) NOT NULL,
  sender_nom VARCHAR(100) NOT NULL,
  sender_telephone VARCHAR(20),
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_vehicles_user ON vehicles(user_id);
CREATE INDEX idx_vehicles_statut ON vehicles(statut);
CREATE INDEX idx_vehicles_boost ON vehicles(boost_level, boost_expires_at);
CREATE INDEX idx_credits_user ON credits_history(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);

-- Insérer des utilisateurs de test
INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified) VALUES
('admin@annonceauto.ci', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin', 'Principal', '+2250707070707', 'admin', 1000, true),
('vendeur@test.ci', '$2b$10$YixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Koné', 'Yao', '+2250101010101', 'vendeur', 50, true)
ON CONFLICT (email) DO NOTHING;

-- CORRECTION DU SCHÉMA SUPABASE
-- Pour correspondre au code backend
-- ================================================

-- Supprimer l'ancienne table users
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Créer la nouvelle table users avec les bonnes colonnes
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  role VARCHAR(20) DEFAULT 'vendeur' CHECK (role IN ('vendeur', 'admin')),
  credits INTEGER DEFAULT 0,
  avatar_url TEXT,
  ville VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table vehicles
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  marque VARCHAR(100) NOT NULL,
  modele VARCHAR(100) NOT NULL,
  annee INTEGER NOT NULL,
  prix DECIMAL(12, 2) NOT NULL,
  kilometrage VARCHAR(50) NOT NULL,
  carburant VARCHAR(50) NOT NULL,
  transmission VARCHAR(50) NOT NULL,
  couleur VARCHAR(50),
  ville VARCHAR(100) NOT NULL,
  commune VARCHAR(100),
  images JSONB DEFAULT '[]',
  equipements JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete', 'vendu')),
  boost_level INTEGER DEFAULT 0,
  boost_expires_at TIMESTAMP,
  vues INTEGER DEFAULT 0,
  favoris INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table credits_history
CREATE TABLE credits_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('achat', 'utilisation', 'remboursement')),
  montant_fcfa DECIMAL(12, 2),
  credits INTEGER NOT NULL,
  description TEXT,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table payments
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  montant DECIMAL(12, 2) NOT NULL,
  credits INTEGER NOT NULL,
  methode VARCHAR(50) NOT NULL CHECK (methode IN ('orange', 'mtn', 'moov', 'wave')),
  telephone VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'reussi', 'echoue')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table boosts
CREATE TABLE boosts (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('standard', 'premium', 'super')),
  credits_utilises INTEGER NOT NULL,
  duree_jours INTEGER NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
  sender_email VARCHAR(255) NOT NULL,
  sender_nom VARCHAR(100) NOT NULL,
  sender_telephone VARCHAR(20),
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performance
CREATE INDEX idx_vehicles_user ON vehicles(user_id);
CREATE INDEX idx_vehicles_statut ON vehicles(statut);
CREATE INDEX idx_vehicles_boost ON vehicles(boost_level, boost_expires_at);
CREATE INDEX idx_credits_user ON credits_history(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);

-- Insérer des utilisateurs de test
INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified) VALUES
('admin@annonceauto.ci', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin', 'Principal', '+2250707070707', 'admin', 1000, true),
('vendeur@test.ci', '$2b$10$YixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Koné', 'Yao', '+2250101010101', 'vendeur', 50, true)
ON CONFLICT (email) DO NOTHING;



