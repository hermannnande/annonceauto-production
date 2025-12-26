import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configuration Payfonte depuis les variables d'environnement
const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID;
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET;
const PAYFONTE_ENV = process.env.PAYFONTE_ENV || 'sandbox';
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// URL de base de l'API Payfonte (Production ou Sandbox)
const PAYFONTE_API_BASE_URL = PAYFONTE_ENV === 'production'
  ? 'https://api.payfonte.com/payments/v1'
  : 'https://sandbox-api.payfonte.com/payments/v1';

/**
 * POST /api/payments/payfonte/create-checkout
 * Crée une session de paiement Payfonte et retourne l'URL de checkout
 */
router.post('/create-checkout', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, country, user, narration } = req.body;
    const userId = req.user.id;

    // Validation des champs obligatoires
    if (!amount || !currency || !country || !user || !user.email || !user.phoneNumber || !user.name) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires manquants (amount, currency, country, user)',
      });
    }

    // Générer une référence unique pour cette transaction
    const reference = `RECHARGE-${userId}-${Date.now()}`;
    
    // URLs de callback et webhook
    const redirectURL = `${SITE_URL}/payfonte/callback`;
    const webhook = `${BACKEND_URL}/api/payments/payfonte/webhook`;

    // Créer un enregistrement "pending" dans la base de données
    const paymentResult = await query(
      `INSERT INTO payments 
       (user_id, amount, currency, payfonte_reference, status, created_at) 
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING *`,
      [userId, amount, currency, reference]
    );

    const paymentId = paymentResult.rows[0].id;

    // Appeler l'API Payfonte pour créer le checkout
    const payfonteResponse = await fetch(`${PAYFONTE_API_BASE_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'client-id': PAYFONTE_CLIENT_ID,
        'client-secret': PAYFONTE_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        country,
        user,
        redirectURL,
        reference,
        narration: narration || `Recharge de crédits AnnonceAuto.ci (User: ${userId})`,
        webhook,
        customerBearsCharge: false, // Le site absorbe les frais
      }),
    });

    const payfonteData = await payfonteResponse.json();

    if (!payfonteResponse.ok) {
      console.error('Erreur API Payfonte:', payfonteData);
      
      // Mettre à jour le paiement comme "failed"
      await query(
        `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = $1`,
        [paymentId]
      );

      return res.status(payfonteResponse.status).json({
        success: false,
        message: payfonteData.message || 'Erreur lors de la création du paiement',
      });
    }

    // Succès : retourner l'URL de checkout
    res.json({
      success: true,
      checkoutUrl: payfonteData.data.url || payfonteData.data.shortURL,
      reference: payfonteData.data.reference,
      paymentId,
    });

  } catch (error) {
    console.error('Erreur create-checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du paiement',
    });
  }
});

/**
 * GET /api/payments/payfonte/verify?reference=XXX
 * Vérifie le statut d'un paiement auprès de Payfonte
 */
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Paramètre "reference" manquant',
      });
    }

    // Appeler l'API Payfonte pour vérifier le paiement
    const payfonteResponse = await fetch(
      `${PAYFONTE_API_BASE_URL}/checkouts/${reference}/verify`,
      {
        method: 'GET',
        headers: {
          'client-id': PAYFONTE_CLIENT_ID,
          'client-secret': PAYFONTE_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    const payfonteData = await payfonteResponse.json();

    if (!payfonteResponse.ok) {
      console.error('Erreur vérification Payfonte:', payfonteData);
      return res.status(payfonteResponse.status).json({
        success: false,
        message: payfonteData.message || 'Erreur lors de la vérification du paiement',
      });
    }

    // Si le paiement est réussi, mettre à jour la base de données
    if (payfonteData.data.status === 'successful') {
      const paymentResult = await query(
        `SELECT * FROM payments WHERE payfonte_reference = $1 LIMIT 1`,
        [reference]
      );

      if (paymentResult.rows.length > 0 && paymentResult.rows[0].status === 'pending') {
        const payment = paymentResult.rows[0];
        const userIdFromPayment = payment.user_id;
        const amount = payment.amount;
        const creditsEarned = Math.floor(amount / 100); // 1 crédit = 100 FCFA

        // Transaction SQL : mise à jour du paiement + ajout des crédits
        try {
          await query('BEGIN');

          // 1. Mettre à jour le statut du paiement
          await query(
            `UPDATE payments SET status = 'completed', updated_at = NOW() WHERE id = $1`,
            [payment.id]
          );

          // 2. Ajouter les crédits à l'utilisateur
          await query(
            `UPDATE users SET credits = credits + $1 WHERE id = $2`,
            [creditsEarned, userIdFromPayment]
          );

          // 3. Enregistrer la transaction de crédits
          await query(
            `INSERT INTO credits_transactions 
             (user_id, type, amount, description, payment_id, created_at) 
             VALUES ($1, 'purchase', $2, $3, $4, NOW())`,
            [
              userIdFromPayment,
              creditsEarned,
              `Achat de crédits via Payfonte (Ref: ${reference})`,
              payment.id,
            ]
          );

          await query('COMMIT');
        } catch (error) {
          await query('ROLLBACK');
          throw error;
        }
      }
    }

    res.json({
      success: true,
      status: payfonteData.data.status,
      amount: payfonteData.data.amount,
    });

  } catch (error) {
    console.error('Erreur verify-payment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification du paiement',
    });
  }
});

/**
 * POST /api/payments/payfonte/webhook
 * Webhook appelé par Payfonte lors d'un événement de paiement
 * ⚠️ Ce endpoint est PUBLIC (appelé par Payfonte) - pas d'auth middleware
 */
router.post('/webhook', async (req, res) => {
  try {
    const { event, data: payfonteData } = req.body;

    console.log('[PAYFONTE WEBHOOK]', event, payfonteData);

    // On traite uniquement les paiements réussis
    if (event !== 'checkout.successful') {
      return res.status(200).json({
        success: true,
        message: `Event ${event} ignoré`,
      });
    }

    const { reference, amount, status } = payfonteData;

    if (!reference || status !== 'successful') {
      return res.status(400).json({
        success: false,
        message: 'Payload webhook invalide',
      });
    }

    // Vérifier le paiement auprès de Payfonte (sécurité supplémentaire)
    const payfonteVerifyResponse = await fetch(
      `${PAYFONTE_API_BASE_URL}/checkouts/${reference}/verify`,
      {
        method: 'GET',
        headers: {
          'client-id': PAYFONTE_CLIENT_ID,
          'client-secret': PAYFONTE_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    const verifiedPayfonteData = await payfonteVerifyResponse.json();

    if (!payfonteVerifyResponse.ok || verifiedPayfonteData.data.status !== 'successful') {
      console.error('Webhook : vérification échouée', verifiedPayfonteData);
      return res.status(400).json({
        success: false,
        message: 'Échec de la vérification du paiement',
      });
    }

    // Récupérer le paiement pending dans notre base
    const paymentResult = await query(
      `SELECT * FROM payments WHERE payfonte_reference = $1 AND status = 'pending' LIMIT 1`,
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      console.warn('Webhook : Paiement pending non trouvé pour reference:', reference);
      return res.status(404).json({
        success: false,
        message: 'Paiement pending non trouvé',
      });
    }

    const payment = paymentResult.rows[0];
    const userId = payment.user_id;
    const paymentAmount = payment.amount;
    const creditsEarned = Math.floor(paymentAmount / 100); // 1 crédit = 100 FCFA

    // Transaction SQL : mise à jour du paiement + ajout des crédits
    try {
      await query('BEGIN');

      // 1. Mettre à jour le statut du paiement
      await query(
        `UPDATE payments SET status = 'completed', updated_at = NOW() WHERE id = $1`,
        [payment.id]
      );

      // 2. Ajouter les crédits à l'utilisateur
      await query(
        `UPDATE users SET credits = credits + $1 WHERE id = $2`,
        [creditsEarned, userId]
      );

      // 3. Enregistrer la transaction de crédits
      await query(
        `INSERT INTO credits_transactions 
         (user_id, type, amount, description, payment_id, created_at) 
         VALUES ($1, 'purchase', $2, $3, $4, NOW())`,
        [
          userId,
          creditsEarned,
          `Achat de crédits via Payfonte Webhook (Ref: ${reference})`,
          payment.id,
        ]
      );

      await query('COMMIT');

      console.log(`[PAYFONTE WEBHOOK] Succès : ${creditsEarned} crédits ajoutés au user ${userId}`);

      res.json({
        success: true,
        message: 'Webhook traité avec succès',
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Erreur webhook Payfonte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du traitement du webhook',
    });
  }
});

export default router;
