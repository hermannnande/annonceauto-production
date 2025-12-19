import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';

const router = express.Router();

// Middleware de validation des erreurs
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 📝 INSCRIPTION
router.post('/register', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court (min 6 caractères)'),
  body('nom').notEmpty().withMessage('Nom requis'),
  body('prenom').notEmpty().withMessage('Prénom requis'),
  body('telephone').notEmpty().withMessage('Téléphone requis')
], handleValidation, async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone, ville } = req.body;

    // Vérifier si l'email existe déjà
    const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await query(`
      INSERT INTO users (email, password, nom, prenom, telephone, ville, credits)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, nom, prenom, telephone, ville, role, credits, created_at
    `, [email, hashedPassword, nom, prenom, telephone, ville, 5]); // 5 crédits offerts à l'inscription

    const user = result.rows[0];

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Inscription réussie ! 5 crédits offerts 🎉',
      token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        ville: user.ville,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// 🔐 CONNEXION
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        ville: user.ville,
        role: user.role,
        credits: user.credits,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// 👤 GET PROFIL (nécessite authentification)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await query(
      'SELECT id, email, nom, prenom, telephone, ville, role, credits, avatar_url, verified, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

// 🔄 RAFRAÎCHIR TOKEN
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Générer un nouveau token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Erreur refresh:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

export default router;


