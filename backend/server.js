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

// Middleware de sécurité
app.use(helmet());

// CORS - Autoriser le frontend
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_LOCAL_URL,
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - Protection contre les attaques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: 'Trop de requêtes, réessayez plus tard.'
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
    message: '🚗 AnnonceAuto.ci API',
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

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
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

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
});

export default app;


