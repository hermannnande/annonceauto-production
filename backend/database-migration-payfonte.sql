-- =====================================================
-- MIGRATION DATABASE POUR PAYFONTE
-- AnnonceAuto.ci
-- =====================================================

-- Ajouter les colonnes nécessaires pour Payfonte dans la table payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payfonte_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'XOF';

-- Créer un index sur payfonte_reference pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_payments_payfonte_reference 
ON payments(payfonte_reference);

-- Mettre à jour les paiements existants qui n'ont pas de devise
UPDATE payments 
SET currency = 'XOF' 
WHERE currency IS NULL;

-- Vérifier les colonnes ajoutées
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name IN ('payfonte_reference', 'currency');

-- Afficher un échantillon des paiements
SELECT id, user_id, amount, currency, payfonte_reference, status, created_at 
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;

COMMIT;




