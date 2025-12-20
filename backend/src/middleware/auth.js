import jwt from 'jsonwebtoken';

// Middleware d'authentification JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'AccÃ¨s non autorisÃ©. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide ou expirÃ©' });
  }
};

// Middleware pour vÃ©rifier le rÃ´le admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'AccÃ¨s rÃ©servÃ© aux administrateurs' });
  }
  next();
};

export default { authenticateToken, requireAdmin };
