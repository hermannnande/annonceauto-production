import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ðŸ“Š LISTE DES UTILISATEURS (Admin seulement)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, email, nom, prenom, telephone, ville, role, credits,
        verified, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Erreur liste utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration' });
  }
});

// ðŸ” DÃ‰TAIL UTILISATEUR
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // VÃ©rifier autorisation (soi-mÃªme ou admin)
    if (parseInt(id) !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisÃ©' });
    }

    const result = await query(`
      SELECT 
        id, email, nom, prenom, telephone, ville, role, credits,
        avatar_url, verified, created_at
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvÃ©' });
    }

    // Stats de l'utilisateur
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM vehicles WHERE user_id = $1) as total_annonces,
        (SELECT COUNT(*) FROM vehicles WHERE user_id = $1 AND statut = 'approuve') as annonces_actives,
        (SELECT COALESCE(SUM(vues), 0) FROM vehicles WHERE user_id = $1) as total_vues
    `, [id]);

    res.json({
      user: result.rows[0],
      stats: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Erreur dÃ©tail utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration' });
  }
});

// âœï¸ MODIFIER PROFIL
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // VÃ©rifier autorisation
    if (parseInt(id) !== userId) {
      return res.status(403).json({ error: 'Non autorisÃ©' });
    }

    const { nom, prenom, telephone, ville, avatar_url } = req.body;

    const result = await query(`
      UPDATE users SET
        nom = COALESCE($1, nom),
        prenom = COALESCE($2, prenom),
        telephone = COALESCE($3, telephone),
        ville = COALESCE($4, ville),
        avatar_url = COALESCE($5, avatar_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, email, nom, prenom, telephone, ville, avatar_url, credits
    `, [nom, prenom, telephone, ville, avatar_url, id]);

    res.json({
      message: 'Profil mis Ã  jour',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur modification profil:', error);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// ðŸ—‘ï¸ SUPPRIMER COMPTE
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // VÃ©rifier autorisation (soi-mÃªme ou admin)
    if (parseInt(id) !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisÃ©' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'Compte supprimÃ©' });
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;
