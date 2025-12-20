import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'annonceauto_secret_key_2024',
    { expiresIn: '7d' }
  );
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone } = req.body;
    if (!email || !password || !nom || !prenom || !telephone) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est deja utilise' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await query(
      `INSERT INTO users (email, password, nom, prenom, telephone, role, credits, verified, created_at)
       VALUES ($1, $2, $3, $4, $5, 'vendeur', 5, false, NOW())
       RETURNING id, email, nom, prenom, telephone, role, credits, verified, created_at`,
      [email.toLowerCase(), hashedPassword, nom, prenom, telephone]
    );
    const user = result.rows[0];
    const token = generateToken(user);
    res.status(201).json({
      message: 'Compte cree avec succes',
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, telephone: user.telephone, role: user.role, credits: user.credits, verified: user.verified },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de l inscription' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const result = await query(
      `SELECT id, email, password, nom, prenom, telephone, role, credits, verified, avatar, created_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const token = generateToken(user);
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    res.json({
      message: 'Connexion reussie',
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, telephone: user.telephone, role: user.role, credits: user.credits, verified: user.verified, avatar: user.avatar },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'annonceauto_secret_key_2024');
      const result = await query(
        `SELECT id, email, nom, prenom, telephone, role, credits, verified, avatar, created_at
         FROM users WHERE id = $1`,
        [decoded.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouve' });
      }
      res.json({ user: result.rows[0] });
    } catch (jwtError) {
      return res.status(401).json({ error: 'Token invalide' });
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Deconnexion reussie' });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    res.json({ message: 'Si cet email existe, un lien de reinitialisation a ete envoye' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
