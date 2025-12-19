import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

// 💰 RECHARGER LE COMPTE (Mobile Money)
router.post('/recharge', authenticateToken, [
  body('montant').isFloat({ min: 1000 }).withMessage('Montant minimum: 1000 FCFA'),
  body('methode').isIn(['orange', 'mtn', 'moov', 'wave']).withMessage('Méthode invalide'),
  body('telephone').notEmpty().withMessage('Téléphone requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { montant, methode, telephone } = req.body;

    // Calculer les crédits (1 crédit = 1000 FCFA)
    const credits = Math.floor(montant / 1000);

    // Générer ID de transaction unique
    const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Créer le paiement en attente
    const paymentResult = await query(`
      INSERT INTO payments (user_id, montant, credits, methode, telephone, transaction_id, statut)
      VALUES ($1, $2, $3, $4, $5, $6, 'en_attente')
      RETURNING *
    `, [userId, montant, credits, methode, telephone, transactionId]);

    // Simuler l'appel API Mobile Money
    // Dans la vraie vie, vous appelleriez l'API correspondante
    const paymentSuccess = await initiateMobileMoneyPayment(methode, telephone, montant, transactionId);

    if (paymentSuccess) {
      // Marquer comme réussi
      await query(`UPDATE payments SET statut = 'reussi', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [paymentResult.rows[0].id]);

      // Créditer le compte
      await query(`UPDATE users SET credits = credits + $1 WHERE id = $2`, [credits, userId]);

      // Historique
      await query(`
        INSERT INTO credits_history (user_id, type, montant_fcfa, credits, description, transaction_id)
        VALUES ($1, 'achat', $2, $3, $4, $5)
      `, [userId, montant, credits, `Recharge via ${methode.toUpperCase()}`, transactionId]);

      res.json({
        message: 'Recharge réussie !',
        transaction: {
          transactionId,
          montant,
          credits,
          methode,
          date: new Date().toISOString()
        }
      });
    } else {
      // Marquer comme échoué
      await query(`UPDATE payments SET statut = 'echoue', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [paymentResult.rows[0].id]);
      
      res.status(402).json({ error: 'Paiement échoué. Vérifiez vos informations.' });
    }
  } catch (error) {
    console.error('Erreur recharge:', error);
    res.status(500).json({ error: 'Erreur lors de la recharge' });
  }
});

// 🎯 BOOSTER UNE ANNONCE
router.post('/boost/:vehicleId', authenticateToken, [
  body('type').isIn(['standard', 'premium', 'super']).withMessage('Type de boost invalide')
], async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { type } = req.body;
    const userId = req.user.userId;

    // Vérifier que l'annonce appartient à l'utilisateur
    const vehicleCheck = await query('SELECT user_id FROM vehicles WHERE id = $1', [vehicleId]);
    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    if (vehicleCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Vous n\'êtes pas propriétaire de cette annonce' });
    }

    // Définir les coûts et durées
    const boostConfig = {
      standard: { credits: 5, duree: 7, level: 1 },
      premium: { credits: 10, duree: 14, level: 2 },
      super: { credits: 20, duree: 30, level: 3 }
    };

    const config = boostConfig[type];

    // Vérifier les crédits
    const userResult = await query('SELECT credits FROM users WHERE id = $1', [userId]);
    const credits = userResult.rows[0].credits;

    if (credits < config.credits) {
      return res.status(402).json({ 
        error: `Crédits insuffisants. Vous avez ${credits} crédits, ${config.credits} requis.` 
      });
    }

    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.duree);

    // Appliquer le boost
    await query(`
      UPDATE vehicles SET
        boost_level = $1,
        boost_expires_at = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [config.level, expiresAt, vehicleId]);

    // Débiter les crédits
    await query('UPDATE users SET credits = credits - $1 WHERE id = $2', [config.credits, userId]);

    // Enregistrer le boost
    await query(`
      INSERT INTO boosts (vehicle_id, user_id, type, credits_utilises, duree_jours, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [vehicleId, userId, type, config.credits, config.duree, expiresAt]);

    // Historique
    await query(`
      INSERT INTO credits_history (user_id, type, credits, description)
      VALUES ($1, 'utilisation', $2, $3)
    `, [userId, -config.credits, `Boost ${type} annonce #${vehicleId}`]);

    res.json({
      message: `Boost ${type} activé avec succès !`,
      boost: {
        type,
        creditsUtilises: config.credits,
        dureeJours: config.duree,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Erreur boost:', error);
    res.status(500).json({ error: 'Erreur lors du boost' });
  }
});

// 📊 HISTORIQUE DES CRÉDITS
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM credits_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Erreur historique:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
});

// 💳 HISTORIQUE DES PAIEMENTS
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM payments
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Erreur paiements:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des paiements' });
  }
});

// 📈 SOLDE ACTUEL
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query('SELECT credits FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ 
      credits: result.rows[0].credits,
      montantFCFA: result.rows[0].credits * 1000
    });
  } catch (error) {
    console.error('Erreur solde:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du solde' });
  }
});

// 🔧 Fonction utilitaire pour initier le paiement Mobile Money
// À REMPLACER par les vraies API
async function initiateMobileMoneyPayment(methode, telephone, montant, transactionId) {
  try {
    // SIMULATION - Dans la vraie vie, appelez l'API correspondante
    console.log(`Initiating ${methode} payment:`, { telephone, montant, transactionId });

    // Orange Money API
    if (methode === 'orange') {
      // const response = await axios.post('https://api.orange.com/orange-money-webpay/...');
      // return response.data.status === 'SUCCESS';
    }

    // MTN Mobile Money API
    if (methode === 'mtn') {
      // const response = await axios.post('https://api.mtn.com/collection/...');
      // return response.data.status === 'SUCCESSFUL';
    }

    // Moov Money API
    if (methode === 'moov') {
      // const response = await axios.post('https://api.moov-africa.com/...');
      // return response.data.status === 'SUCCESS';
    }

    // Wave API
    if (methode === 'wave') {
      // const response = await axios.post('https://api.wave.com/...');
      // return response.data.status === 'completed';
    }

    // SIMULATION: 90% de succès
    return Math.random() > 0.1;
  } catch (error) {
    console.error('Erreur Mobile Money:', error);
    return false;
  }
}

export default router;



