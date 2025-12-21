import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/payments/initiate - Initier un paiement
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const { packageId, paymentMethod } = req.body;
    const userId = req.user.id;

    const packages = {
      1: { credits: 5, price: 2500 },
      2: { credits: 10, price: 4500 },
      3: { credits: 25, price: 10000 },
      4: { credits: 50, price: 18000 },
      5: { credits: 100, price: 32000 }
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Forfait invalide' });
    }

    const result = await query(
      `INSERT INTO payments (user_id, amount, credits, payment_method, status, created_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW())
       RETURNING *`,
      [userId, selectedPackage.price, selectedPackage.credits, paymentMethod || 'mobile_money']
    );

    res.json({
      message: 'Paiement initie',
      payment: result.rows[0]
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/payments/confirm - Confirmer un paiement
router.post('/confirm', async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const paymentResult = await query(
      'SELECT * FROM payments WHERE id = $1 AND status = $2',
      [paymentId, 'pending']
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Paiement non trouve ou deja traite' });
    }

    const payment = paymentResult.rows[0];

    await query(
      `UPDATE payments SET status = 'completed', transaction_id = $1, completed_at = NOW() 
       WHERE id = $2`,
      [transactionId, paymentId]
    );

    await query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2',
      [payment.credits, payment.user_id]
    );

    await query(
      `INSERT INTO credits_history (user_id, amount, type, description, created_at)
       VALUES ($1, $2, 'credit', $3, NOW())`,
      [payment.user_id, payment.credits, 'Achat de ' + payment.credits + ' credits']
    );

    res.json({ message: 'Paiement confirme, credits ajoutes' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/payments/history - Historique des paiements
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/payments/:id - Detail d un paiement
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM payments WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paiement non trouve' });
    }
    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;