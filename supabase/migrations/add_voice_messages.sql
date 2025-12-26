-- ============================================
-- MESSAGES VOCAUX - MIGRATION
-- Ajoute le support des messages vocaux
-- ============================================

-- 1. Ajouter la colonne audio_url dans la table messages
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS audio_duration INTEGER DEFAULT 0;

-- 2. Ajouter un index pour la performance
CREATE INDEX IF NOT EXISTS idx_messages_audio_url ON messages(audio_url) WHERE audio_url IS NOT NULL;

-- 3. Créer le bucket Supabase Storage pour les audios (à exécuter dans Supabase Dashboard > Storage)
-- Bucket name: message-audios
-- Public: false (seulement accessibles par les participants de la conversation)

-- 4. Politique RLS pour le bucket message-audios
-- Les utilisateurs peuvent uploader des audios pour leurs propres messages
CREATE POLICY "Users can upload audio for own messages"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-audios'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Les participants d'une conversation peuvent lire les audios
CREATE POLICY "Conversation participants can read audios"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-audios'
  AND EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.audio_url LIKE '%' || name || '%'
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- 5. Commentaires
COMMENT ON COLUMN messages.audio_url IS 'URL du fichier audio (Supabase Storage) si message vocal';
COMMENT ON COLUMN messages.audio_duration IS 'Durée du message vocal en secondes';

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================

-- 1. Exécuter ce script dans Supabase SQL Editor
-- 2. Aller dans Storage > Create bucket
--    - Name: message-audios
--    - Public: false
--    - File size limit: 10 MB
--    - Allowed MIME types: audio/webm, audio/mp4, audio/ogg
-- 3. Les RLS policies seront automatiquement appliquées

-- ============================================
-- EXEMPLE D'INSERTION
-- ============================================

-- INSERT INTO messages (conversation_id, sender_id, receiver_id, content, audio_url, audio_duration)
-- VALUES (
--   'uuid-conversation',
--   'uuid-sender',
--   'uuid-receiver',
--   '🎤 Message vocal',
--   'https://xxx.supabase.co/storage/v1/object/public/message-audios/user-id/audio-file.webm',
--   45
-- );

