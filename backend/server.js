import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
import authRoutes from './src/routes/auth.routes.js';
import vehicleRoutes from './src/routes/vehicle.routes.js';
import creditRoutes from './src/routes/credit.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sÃƒÂ©curitÃƒÂ©
app.use(helmet());

// CORS - Autoriser toutes les origines (temporaire pour debug)
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting - Protection contre les attaques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requÃƒÂªtes par IP
  message: 'Trop de requÃƒÂªtes, rÃƒÂ©essayez plus tard.'
});
app.use('/api/', limiter);

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Ã°Å¸Å¡â€” AnnonceAuto.ci API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      credits: '/api/credits',
      payments: '/api/payments',
      users: '/api/users',
      upload: '/api/upload'
    }
  });
});

// Route de santÃƒÂ©
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route de test de la base de donnÃƒÂ©es
app.get('/api/test-db', async (req, res) => {
  try {
    const { query } = await import('./src/config/database.js');
    const result = await query('SELECT COUNT(*) as count FROM users');
    res.json({ 
      success: true, 
      message: 'Base de donnÃƒÂ©es OK',
      users_count: result.rows[0].count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvÃƒÂ©e',
    path: req.path
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// DÃƒÂ©marrer le serveur

// Create super admin if not exists
async function createAdminIfNotExists() {
  try {
    const { query } = await import('./src/config/database.js');
    const adminEmail = 'hermannnande@gmail.com';
    
    // Check if admin exists
    const existing = await query('SELECT id FROM users WHERE email = app.listen(PORT', [adminEmail]);
    
    if (existing.rows.length === 0) {
      // Create admin with pre-hashed password
      await query(`
        INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified)
        VALUES (app.listen(PORT, $2, $3, $4, $5, $6, $7, $8)
      `, [
        adminEmail,
        '$2a$10$XLMUFLdE30tgVbhmoejpxONmWybZTU/T25cAkLSK8oQEYViawy8Cm',
        'nande',
        'hermann',
        '+2250778030075',
        'admin',
        1000,
        true
      ]);
      console.log('Super Admin created: hermannnande@gmail.com');
    } else {
      console.log('Super Admin already exists');
    }
  } catch (error) {
    console.log('Admin check skipped (table may not exist yet)');
  }
}

// Call createAdminIfNotExists after DB connection
createAdminIfNotExists();

app.listen(PORT, async () => {
  console.log(`Ã°Å¸Å¡â‚¬ Serveur dÃƒÂ©marrÃƒÂ© sur le port ${PORT}`);
  console.log(`Ã°Å¸â€œÂ http://localhost:${PORT}`);
  console.log(`Ã°Å¸Å’Â Environnement: ${process.env.NODE_ENV}`);
  
  // Test de connexion ÃƒÂ  la base de donnÃƒÂ©es
  try {
    const { query } = await import('./src/config/database.js');
    await query('SELECT NOW()');
    console.log('Ã¢Å“â€¦ Base de donnÃƒÂ©es connectÃƒÂ©e !');
  } catch (error) {
    console.error('Ã¢ÂÅ’ Erreur de connexion ÃƒÂ  la base de donnÃƒÂ©es:', error.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'dÃƒÂ©finie' : 'NON dÃƒÂ©finie');
  }
});

export default app;
