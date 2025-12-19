import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
});

// Fonction utilitaire pour exécuter des requêtes
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Requête exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erreur requête:', error);
    throw error;
  }
};

// Créer les tables si elles n'existent pas
export const createTables = async () => {
  try {
    // Table users
    await query(`
      CREATE TABLE IF NOT EXISTS users (
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
    `);

    // Table vehicles (annonces)
    await query(`
      CREATE TABLE IF NOT EXISTS vehicles (
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
    `);

    // Table credits_history
    await query(`
      CREATE TABLE IF NOT EXISTS credits_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('achat', 'utilisation', 'remboursement')),
        montant_fcfa DECIMAL(12, 2),
        credits INTEGER NOT NULL,
        description TEXT,
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table payments
    await query(`
      CREATE TABLE IF NOT EXISTS payments (
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
    `);

    // Table boosts
    await query(`
      CREATE TABLE IF NOT EXISTS boosts (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('standard', 'premium', 'super')),
        credits_utilises INTEGER NOT NULL,
        duree_jours INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table messages (contact vendeur)
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        sender_email VARCHAR(255) NOT NULL,
        sender_nom VARCHAR(100) NOT NULL,
        sender_telephone VARCHAR(20),
        message TEXT NOT NULL,
        lu BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Index pour performance
    await query(`CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_vehicles_statut ON vehicles(statut);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_vehicles_boost ON vehicles(boost_level, boost_expires_at);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_credits_user ON credits_history(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);`);

    console.log('✅ Tables créées avec succès');
  } catch (error) {
    console.error('❌ Erreur création tables:', error);
    throw error;
  }
};

export default pool;


