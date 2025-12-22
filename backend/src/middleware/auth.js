import jwt from 'jsonwebtoken';

// Middleware pour verifier le token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'annonceauto_secret_key_2024');

    // Normaliser l'identifiant pour compatibilite (id vs userId)
    const id = decoded?.id ?? decoded?.userId;
    req.user = {
      ...decoded,
      id,
      userId: id,
    };

    if (!req.user.id) {
      return res.status(401).json({ error: 'Token invalide ou expire' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: 'Token invalide ou expire' });
  }
};

// Middleware pour verifier le role admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifie' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acces refuse - Admin requis' });
  }

  next();
};

// Middleware pour verifier le role super_admin
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Non authentifie' });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acces refuse - Super Admin requis' });
  }

  next();
};

export default { authenticateToken, requireAdmin, requireSuperAdmin };