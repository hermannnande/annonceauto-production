-- ================================================
-- SCHEMA BASE DE DONNÉES ANNONCEAUTO.CI
-- Base : PostgreSQL (Supabase)
-- ================================================

-- ================================================
-- TABLE : users
-- Gestion des utilisateurs (vendeurs et admins)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'vendor' CHECK (role IN ('vendor', 'admin')),
    credits INT DEFAULT 0,
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ================================================
-- TABLE : vehicles
-- Gestion des annonces de véhicules
-- ================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    mileage INT,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    location VARCHAR(255),
    images TEXT[], -- Array de URLs d'images
    is_boosted BOOLEAN DEFAULT false,
    boost_expiry TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'rejected')),
    views INT DEFAULT 0,
    whatsapp_contacts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_boosted ON vehicles(is_boosted);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- ================================================
-- TABLE : transactions
-- Historique des recharges de crédits et boosts
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credit_purchase', 'boost_ad', 'post_ad')),
    amount DECIMAL(10, 2) NOT NULL,
    credits INT NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
    metadata JSONB, -- Données supplémentaires (numéro tel, opérateur, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- ================================================
-- TABLE : reports
-- Signalements d'annonces
-- ================================================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    reporter_id INT REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reports_vehicle_id ON reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- ================================================
-- TABLE : favorites
-- Favoris des utilisateurs
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vehicle_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vehicle_id ON favorites(vehicle_id);

-- ================================================
-- FONCTION : Mettre à jour updated_at automatiquement
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONNÉES DE TEST : Compte admin par défaut
-- Mot de passe : Admin@2025
-- ================================================
INSERT INTO users (email, password, full_name, phone, role, credits, is_verified, is_active)
VALUES (
    'admin@annonceauto.ci',
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- Admin@2025
    'Administrateur Principal',
    '+2250707070707',
    'admin',
    1000,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- ================================================
-- DONNÉES DE TEST : Compte vendeur de test
-- Mot de passe : Vendeur@2025
-- ================================================
INSERT INTO users (email, password, full_name, phone, role, credits, is_verified, is_active)
VALUES (
    'vendeur@test.ci',
    '$2b$10$YixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- Vendeur@2025
    'Vendeur Test',
    '+2250101010101',
    'vendor',
    50,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- ================================================
-- FIN DU SCHEMA
-- ================================================

-- SCHEMA BASE DE DONNÉES ANNONCEAUTO.CI
-- Base : PostgreSQL (Supabase)
-- ================================================

-- ================================================
-- TABLE : users
-- Gestion des utilisateurs (vendeurs et admins)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'vendor' CHECK (role IN ('vendor', 'admin')),
    credits INT DEFAULT 0,
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ================================================
-- TABLE : vehicles
-- Gestion des annonces de véhicules
-- ================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    mileage INT,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    color VARCHAR(50),
    description TEXT,
    location VARCHAR(255),
    images TEXT[], -- Array de URLs d'images
    is_boosted BOOLEAN DEFAULT false,
    boost_expiry TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'rejected')),
    views INT DEFAULT 0,
    whatsapp_contacts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_boosted ON vehicles(is_boosted);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- ================================================
-- TABLE : transactions
-- Historique des recharges de crédits et boosts
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('credit_purchase', 'boost_ad', 'post_ad')),
    amount DECIMAL(10, 2) NOT NULL,
    credits INT NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
    metadata JSONB, -- Données supplémentaires (numéro tel, opérateur, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- ================================================
-- TABLE : reports
-- Signalements d'annonces
-- ================================================
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    reporter_id INT REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reports_vehicle_id ON reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- ================================================
-- TABLE : favorites
-- Favoris des utilisateurs
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vehicle_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vehicle_id ON favorites(vehicle_id);

-- ================================================
-- FONCTION : Mettre à jour updated_at automatiquement
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONNÉES DE TEST : Compte admin par défaut
-- Mot de passe : Admin@2025
-- ================================================
INSERT INTO users (email, password, full_name, phone, role, credits, is_verified, is_active)
VALUES (
    'admin@annonceauto.ci',
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- Admin@2025
    'Administrateur Principal',
    '+2250707070707',
    'admin',
    1000,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- ================================================
-- DONNÉES DE TEST : Compte vendeur de test
-- Mot de passe : Vendeur@2025
-- ================================================
INSERT INTO users (email, password, full_name, phone, role, credits, is_verified, is_active)
VALUES (
    'vendeur@test.ci',
    '$2b$10$YixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- Vendeur@2025
    'Vendeur Test',
    '+2250101010101',
    'vendor',
    50,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- ================================================
-- FIN DU SCHEMA
-- ================================================



