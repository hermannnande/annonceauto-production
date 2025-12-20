import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://annonceauto.vercel.app',
    'https://voitureoccasion.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'AnnonceAuto API - Backend en ligne',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

import authRoutes from './src/routes/auth.routes.js';
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvee',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

async function createSuperAdmin() {
  try {
    const { query } = await import('./src/config/database.js');
    const adminEmail = 'hermannnande@gmail.com';
    const existing = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existing.rows.length === 0) {
      const hashedPassword = '$2a$10$XLMUFLdE30tgVbhmoejpxONmWybZTU/T25cAkLSK8oQEYViawy8Cm';
      await query(
        `INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [adminEmail, hashedPassword, 'nande', 'hermann', '+2250778030075', 'admin', 1000, true]
      );
      console.log('Super Admin cree: hermannnande@gmail.com');
    } else {
      const hashedPassword = '$2a$10$XLMUFLdE30tgVbhmoejpxONmWybZTU/T25cAkLSK8oQEYViawy8Cm';
      await query(
        `UPDATE users SET password = $1, role = $2, verified = $3, credits = $4 WHERE email = $5`,
        [hashedPassword, 'admin', true, 1000, adminEmail]
      );
      console.log('Super Admin mis a jour: hermannnande@gmail.com');
    }
  } catch (error) {
    console.log('Creation admin ignoree:', error.message);
  }
}

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Serveur AnnonceAuto demarre sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${new Date().toLocaleString('fr-FR')}`);
  await createSuperAdmin();
});
