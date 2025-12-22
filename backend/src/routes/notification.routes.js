import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const DEFAULT_PREFERENCES = {
  // Vendeur
  newViews: true,
  newFavorites: true,
  messages: true,
  moderation: true,
  boostExpiry: true,
  lowCredits: true,

  // Admin
  newListings: true,
  reports: true,
  payments: true,
  dailyReports: true,
  creditsAssigned: true,
  systemAlerts: true,
};

let columnEnsured = false;
async function ensureNotificationPrefsColumn() {
  if (columnEnsured) return;
  try {
    await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB');
    columnEnsured = true;
  } catch (error) {
    // Ne bloque pas l'API si le role DB ne permet pas ALTER (cas rare)
    console.error('Ensure notification_preferences column error:', error);
  }
}

// GET /api/notifications/preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    await ensureNotificationPrefsColumn();

    const result = await query('SELECT notification_preferences FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows?.length) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    const prefs = result.rows[0].notification_preferences || DEFAULT_PREFERENCES;
    return res.json({ preferences: prefs });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/notifications/preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    await ensureNotificationPrefsColumn();

    const { preferences } = req.body;
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Preferences invalides' });
    }

    const result = await query(
      'UPDATE users SET notification_preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING notification_preferences',
      [JSON.stringify(preferences), req.user.id]
    );

    if (!result.rows?.length) {
      return res.status(404).json({ error: 'Utilisateur non trouve' });
    }

    return res.json({
      message: 'Preferences de notification enregistrees avec succes',
      preferences: result.rows[0].notification_preferences,
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise a jour' });
  }
});

export default router;
