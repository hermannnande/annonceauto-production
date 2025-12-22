import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

import authRoutes from './src/routes/auth.routes.js';
import vehicleRoutes from './src/routes/vehicle.routes.js';
import creditRoutes from './src/routes/credit.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import userRoutes from './src/routes/user.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Railway/Reverse proxy: required for express-rate-limit when X-Forwarded-For is set
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://annonceauto.vercel.app',
  'https://voitureoccasion.vercel.app',
  'https://annonceauto-production.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Rate limiting - basic protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Root/health
app.get('/', (req, res) => {
  res.json({
    message: 'AnnonceAuto.ci API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      credits: '/api/credits',
      payments: '/api/payments',
      users: '/api/users',
      upload: '/api/upload',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test DB (kept for debugging)
app.get('/api/test-db', async (req, res) => {
  try {
    const { query } = await import('./src/config/database.js');
    const result = await query('SELECT NOW()');
    res.json({ success: true, message: 'Database OK', now: result.rows?.[0]?.now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ensure super admin exists (best-effort)
async function createSuperAdmin() {
  try {
    const { query } = await import('./src/config/database.js');

    const adminEmail = 'hermannnande@gmail.com';
    const hashedPassword = '$2a$10$XLMUFLdE30tgVbhmoejpxONmWybZTU/T25cAkLSK8oQEYViawy8Cm'; // Nande19912012.

    // Pick desired role based on DB check constraint (avoids noisy errors)
    let desiredRole = 'admin';
    try {
      const constraint = await query(
        `SELECT pg_get_constraintdef(c.oid) AS def
         FROM pg_constraint c
         WHERE c.conname = 'users_role_check'
         LIMIT 1`
      );
      const def = constraint?.rows?.[0]?.def || '';
      if (def.includes('super_admin')) desiredRole = 'super_admin';
    } catch {
      // ignore
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [adminEmail, hashedPassword, 'nande', 'hermann', '+2250778030075', desiredRole, 1000, true]
      );
    } else {
      await query(
        'UPDATE users SET password = $1, role = $2, verified = $3, credits = $4 WHERE email = $5',
        [hashedPassword, desiredRole, true, 1000, adminEmail]
      );
    }

    console.log('SUPER_ADMIN ensured:', adminEmail, 'role:', desiredRole);
  } catch (error) {
    console.log('SUPER_ADMIN init skipped:', error.message);
  }
}

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  await createSuperAdmin();
});

export default app;