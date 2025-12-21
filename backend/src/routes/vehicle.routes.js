import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 📋 LISTER TOUTES LES ANNONCES (public)
router.get('/', async (req, res) => {
  try {
    const {
      marque,
      modele,
      anneeMin,
      anneeMax,
      prixMin,
      prixMax,
      ville,
      carburant,
      transmission,
      page = 1,
      limit = 12,
      sort = 'recent'
    } = req.query;

    let whereConditions = ["statut = 'approuve'"];
    let params = [];
    let paramCount = 1;

    // Filtres
    if (marque) {
      whereConditions.push(`marque ILIKE $${paramCount++}`);
      params.push(`%${marque}%`);
    }
    if (modele) {
      whereConditions.push(`modele ILIKE $${paramCount++}`);
      params.push(`%${modele}%`);
    }
    if (anneeMin) {
      whereConditions.push(`annee >= $${paramCount++}`);
      params.push(anneeMin);
    }
    if (anneeMax) {
      whereConditions.push(`annee <= $${paramCount++}`);
      params.push(anneeMax);
    }
    if (prixMin) {
      whereConditions.push(`prix >= $${paramCount++}`);
      params.push(prixMin);
    }
    if (prixMax) {
      whereConditions.push(`prix <= $${paramCount++}`);
      params.push(prixMax);
    }
    if (ville) {
      whereConditions.push(`ville ILIKE $${paramCount++}`);
      params.push(`%${ville}%`);
    }
    if (carburant) {
      whereConditions.push(`carburant = $${paramCount++}`);
      params.push(carburant);
    }
    if (transmission) {
      whereConditions.push(`transmission = $${paramCount++}`);
      params.push(transmission);
    }

    const whereClause = whereConditions.join(' AND ');

    // Tri
    let orderBy;
    switch (sort) {
      case 'prix_asc':
        orderBy = 'prix ASC';
        break;
      case 'prix_desc':
        orderBy = 'prix DESC';
        break;
      case 'ancien':
        orderBy = 'created_at ASC';
        break;
      default:
        orderBy = 'boost_level DESC, created_at DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;

    // Requête
    const result = await query(`
      SELECT 
        v.*,
        u.nom || ' ' || u.prenom as vendeur_nom,
        u.telephone as vendeur_telephone,
        u.ville as vendeur_ville
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...params, limit, offset]);

    // Compter le total
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM vehicles
      WHERE ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      vehicles: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Erreur liste véhicules:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
});

// 🔍 DÉTAIL D'UNE ANNONCE (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Incrémenter les vues
    await query('UPDATE vehicles SET vues = vues + 1 WHERE id = $1', [id]);

    // Récupérer l'annonce
    const result = await query(`
      SELECT 
        v.*,
        u.nom || ' ' || u.prenom as vendeur_nom,
        u.telephone as vendeur_telephone,
        u.email as vendeur_email,
        u.ville as vendeur_ville,
        u.avatar_url as vendeur_avatar
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    res.json({ vehicle: result.rows[0] });
  } catch (error) {
    console.error('Erreur détail véhicule:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce' });
  }
});

// ✍️ CRÉER UNE ANNONCE (authentifié, coûte 1 crédit)
router.post('/', authenticateToken, [
  body('titre').notEmpty().withMessage('Titre requis'),
  body('description').notEmpty().withMessage('Description requise'),
  body('marque').notEmpty().withMessage('Marque requise'),
  body('modele').notEmpty().withMessage('Modèle requis'),
  body('annee').isInt({ min: 1990, max: 2025 }).withMessage('Année invalide'),
  body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('kilometrage').notEmpty().withMessage('Kilométrage requis'),
  body('carburant').notEmpty().withMessage('Carburant requis'),
  body('transmission').notEmpty().withMessage('Transmission requise'),
  body('ville').notEmpty().withMessage('Ville requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;

    // Vérifier les crédits
    const userResult = await query('SELECT credits FROM users WHERE id = $1', [userId]);
    const credits = userResult.rows[0].credits;

    if (credits < 1) {
      return res.status(402).json({ error: 'Crédits insuffisants. Rechargez votre compte.' });
    }

    // Créer l'annonce
    const {
      titre, description, marque, modele, annee, prix, kilometrage,
      carburant, transmission, couleur, ville, commune, images, equipements
    } = req.body;

    const result = await query(`
      INSERT INTO vehicles (
        user_id, titre, description, marque, modele, annee, prix,
        kilometrage, carburant, transmission, couleur, ville, commune,
        images, equipements
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      userId, titre, description, marque, modele, annee, prix,
      kilometrage, carburant, transmission, couleur, ville, commune,
      JSON.stringify(images || []), JSON.stringify(equipements || [])
    ]);

    // Débiter 1 crédit
    await query('UPDATE users SET credits = credits - 1 WHERE id = $1', [userId]);

    // Historique
    await query(`
      INSERT INTO credits_history (user_id, type, credits, description)
      VALUES ($1, 'utilisation', -1, 'Publication annonce')
    `, [userId]);

    res.status(201).json({
      message: 'Annonce créée avec succès ! En attente de modération.',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur création annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'annonce' });
  }
});

// 📝 MODIFIER UNE ANNONCE (propriétaire seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Vérifier que l'utilisateur est propriétaire
    const checkOwner = await query('SELECT user_id FROM vehicles WHERE id = $1', [id]);
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    if (checkOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const {
      titre, description, marque, modele, annee, prix, kilometrage,
      carburant, transmission, couleur, ville, commune, images, equipements
    } = req.body;

    const result = await query(`
      UPDATE vehicles SET
        titre = COALESCE($1, titre),
        description = COALESCE($2, description),
        marque = COALESCE($3, marque),
        modele = COALESCE($4, modele),
        annee = COALESCE($5, annee),
        prix = COALESCE($6, prix),
        kilometrage = COALESCE($7, kilometrage),
        carburant = COALESCE($8, carburant),
        transmission = COALESCE($9, transmission),
        couleur = COALESCE($10, couleur),
        ville = COALESCE($11, ville),
        commune = COALESCE($12, commune),
        images = COALESCE($13, images),
        equipements = COALESCE($14, equipements),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `, [
      titre, description, marque, modele, annee, prix, kilometrage,
      carburant, transmission, couleur, ville, commune,
      images ? JSON.stringify(images) : null,
      equipements ? JSON.stringify(equipements) : null,
      id
    ]);

    res.json({
      message: 'Annonce mise à jour',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur modification annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// 🗑️ SUPPRIMER UNE ANNONCE (propriétaire ou admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const checkOwner = await query('SELECT user_id FROM vehicles WHERE id = $1', [id]);
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    // Vérifier autorisation
    if (checkOwner.rows[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await query('DELETE FROM vehicles WHERE id = $1', [id]);

    res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    console.error('Erreur suppression annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// 📊 MES ANNONCES (utilisateur authentifié)
router.get('/user/my-listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM vehicles
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json({ vehicles: result.rows });
  } catch (error) {
    console.error('Erreur mes annonces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

export default router;


