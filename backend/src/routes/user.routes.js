import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me - Profil de l'utilisateur connecte
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, nom, prenom, telephone, ville, role, credits, verified, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/me - Mise a jour profil (nom/prenom/email/telephone/ville)
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const { nom, prenom, telephone, email, ville } = req.body;

    const updates = [];
    const values = [];
    let idx = 1;

    if (nom !== undefined) {
      updates.push(`nom = $${idx++}`);
      values.push(nom);
    }
    if (prenom !== undefined) {
      updates.push(`prenom = $${idx++}`);
      values.push(prenom);
    }
    if (telephone !== undefined) {
      updates.push(`telephone = $${idx++}`);
      values.push(telephone);
    }
    if (ville !== undefined) {
      updates.push(`ville = $${idx++}`);
      values.push(ville);
    }
    if (email !== undefined) {
      const emailLower = String(email).toLowerCase();
      const existingEmail = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [emailLower, id]);
      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est deja utilise' });
      }
      updates.push(`email = $${idx++}`);
      values.push(emailLower);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnee a mettre a jour' });
    }

    values.push(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${idx}
       RETURNING id, email, nom, prenom, telephone, ville, role, credits, verified, created_at, updated_at`,
      values
    );

    return res.json({ message: 'Profil mis a jour avec succes', user: result.rows[0] });
  } catch (error) {
    console.error('Update me error:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise a jour' });
  }
});

// GET /api/users - Liste des utilisateurs (admin seulement)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, nom, prenom, telephone, ville, role, credits, verified, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Erreur liste utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la recuperation' });
  }
});

// GET /api/users/:id - Detail utilisateur (soi-meme ou admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);

    if (Number.isNaN(targetId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (targetId !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Non autorise' });
    }

    const result = await query(
      `SELECT id, email, nom, prenom, telephone, ville, role, credits, avatar_url, verified, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [targetId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erreur detail utilisateur:', error);
    return res.status(500).json({ error: 'Erreur lors de la recuperation' });
  }
});

// PUT /api/users/:id - Modifier profil (soi-meme ou admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);

    if (Number.isNaN(targetId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    if (targetId !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Non autorise' });
    }

    const { nom, prenom, telephone, ville, avatar_url } = req.body;

    const result = await query(
      `UPDATE users SET
        nom = COALESCE($1, nom),
        prenom = COALESCE($2, prenom),
        telephone = COALESCE($3, telephone),
        ville = COALESCE($4, ville),
        avatar_url = COALESCE($5, avatar_url),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, email, nom, prenom, telephone, ville, avatar_url, role, credits, verified, created_at, updated_at`,
      [nom, prenom, telephone, ville, avatar_url, targetId]
    );

    return res.json({ message: 'Profil mis a jour', user: result.rows[0] });
  } catch (error) {
    console.error('Erreur modification profil:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// PUT /api/users/:id/password - Changer mot de passe (soi-meme)
router.put('/:id/password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = parseInt(id, 10);

    if (Number.isNaN(targetId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    if (targetId !== req.user.id) {
      return res.status(403).json({ error: 'Non autorise' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    }

    const userResult = await query('SELECT password FROM users WHERE id = $1', [targetId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    const ok = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!ok) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashed, targetId]);

    return res.json({ message: 'Mot de passe mis a jour' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    return res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
});

export default router;