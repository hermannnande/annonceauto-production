import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ðŸ“‹ LISTER TOUTES LES ANNONCES (public)
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

    // RequÃªte
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
    console.error('Erreur liste vÃ©hicules:', error);
    res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration des annonces' });
  }
});

// ðŸ” DÃ‰TAIL D'UNE ANNONCE (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // IncrÃ©menter les vues
    await query('UPDATE vehicles SET vues = vues + 1 WHERE id = $1', [id]);

    // RÃ©cupÃ©rer l'annonce
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
      return res.status(404).json({ error: 'Annonce non trouvÃ©e' });
    }

    res.json({ vehicle: result.rows[0] });
  } catch (error) {
    console.error('Erreur dÃ©tail vÃ©hicule:', error);
    res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration de l\'annonce' });
  }
});

// âœï¸ CRÃ‰ER UNE ANNONCE (authentifiÃ©, coÃ»te 1 crÃ©dit)
router.post('/', authenticateToken, [
  body('titre').notEmpty().withMessage('Titre requis'),
  body('description').notEmpty().withMessage('Description requise'),
  body('marque').notEmpty().withMessage('Marque requise'),
  body('modele').notEmpty().withMessage('ModÃ¨le requis'),
  body('annee').isInt({ min: 1990, max: 2025 }).withMessage('AnnÃ©e invalide'),
  body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('kilometrage').notEmpty().withMessage('KilomÃ©trage requis'),
  body('carburant').notEmpty().withMessage('Carburant requis'),
  body('transmission').notEmpty().withMessage('Transmission requise'),
  body('ville').notEmpty().withMessage('Ville requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id || req.user.userId;


    // CrÃ©er l'annonce
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



    res.status(201).json({
      message: 'Annonce crÃ©Ã©e avec succÃ¨s ! En attente de modÃ©ration.',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur crÃ©ation annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la crÃ©ation de l\'annonce' });
  }
});

// ðŸ“ MODIFIER UNE ANNONCE (propriÃ©taire seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    // VÃ©rifier que l'utilisateur est propriÃ©taire
    const checkOwner = await query('SELECT user_id FROM vehicles WHERE id = $1', [id]);
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvÃ©e' });
    }
    if (checkOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Non autorisÃ©' });
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
      message: 'Annonce mise Ã  jour',
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur modification annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// ðŸ—‘ï¸ SUPPRIMER UNE ANNONCE (propriÃ©taire ou admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;
    const userRole = req.user.role;

    const checkOwner = await query('SELECT user_id FROM vehicles WHERE id = $1', [id]);
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Annonce non trouvÃ©e' });
    }

    // VÃ©rifier autorisation
    if (checkOwner.rows[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Non autorisÃ©' });
    }

    await query('DELETE FROM vehicles WHERE id = $1', [id]);

    res.json({ message: 'Annonce supprimÃ©e' });
  } catch (error) {
    console.error('Erreur suppression annonce:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ðŸ“Š MES ANNONCES (utilisateur authentifiÃ©)
router.get('/user/my-listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const result = await query(`
      SELECT * FROM vehicles
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json({ vehicles: result.rows });
  } catch (error) {
    console.error('Erreur mes annonces:', error);
    res.status(500).json({ error: 'Erreur lors de la rÃ©cupÃ©ration' });
  }
});

export default router;

