/**
 * 🎤 GUIDE D'INTÉGRATION DES MESSAGES VOCAUX
 * 
 * Ce fichier montre comment intégrer le système de messages vocaux
 * dans votre page de messagerie existante.
 */

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { MessageActionsMenu } from '../components/messages/MessageActionsMenu';
import { VoicePlayer } from '../components/messages/VoicePlayer';
import { audioService } from '../../services/audio.service';
import { supabase } from '../lib/supabase';

// ============================================
// EXEMPLE D'UTILISATION DANS UNE PAGE
// ============================================

export function ExampleMessagingPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const currentUserId = 'user-id'; // Récupérer depuis useAuth()

  /**
   * ÉTAPE 1 : Gérer l'enregistrement vocal
   */
  const handleVoiceRecorded = async (audioBlob: Blob, duration: number) => {
    try {
      setIsUploadingAudio(true);
      toast.loading('📤 Envoi du message vocal...');

      // Valider l'audio
      const validation = await audioService.validateAudio(audioBlob);
      if (!validation.valid) {
        toast.error(validation.error || 'Audio invalide');
        return;
      }

      // Upload vers Supabase Storage
      const audioUrl = await audioService.uploadAudio(audioBlob, currentUserId);

      // Insérer le message dans la BDD
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: 'conversation-id',
          sender_id: currentUserId,
          receiver_id: 'receiver-id',
          content: '🎤 Message vocal',
          audio_url: audioUrl,
          audio_duration: duration,
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter à la liste locale
      setMessages((prev) => [...prev, data]);
      
      toast.success('✅ Message vocal envoyé !');
    } catch (error) {
      console.error('Erreur envoi vocal:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  /**
   * ÉTAPE 2 : Afficher les messages (texte + vocal)
   */
  const renderMessage = (message: any) => {
    const isSender = message.sender_id === currentUserId;

    return (
      <div
        key={message.id}
        className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {/* Message vocal */}
        {message.audio_url ? (
          <VoicePlayer
            audioUrl={message.audio_url}
            duration={message.audio_duration || 0}
            isSender={isSender}
          />
        ) : (
          /* Message texte */
          <div
            className={`
              px-4 py-2 rounded-lg max-w-[70%]
              ${isSender ? 'bg-[#FACC15] text-white' : 'bg-gray-100 text-gray-900'}
            `}
          >
            {message.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="font-semibold">Conversation</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(renderMessage)}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center gap-2">
          {/* Menu d'actions avec bouton vocal */}
          <MessageActionsMenu
            onVoiceRecorded={handleVoiceRecorded}
            isMobile={false}
          />

          <input
            type="text"
            placeholder="Écrivez un message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            disabled={isUploadingAudio}
          />

          <button
            className="bg-[#FACC15] text-white px-6 py-2 rounded-full hover:bg-[#F5C61A] disabled:opacity-50"
            disabled={isUploadingAudio}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// INSTRUCTIONS D'INTÉGRATION
// ============================================

/**
 * POUR INTÉGRER DANS VOTRE PAGE EXISTANTE :
 * 
 * 1. Import des composants :
 *    ```typescript
 *    import { MessageActionsMenu } from './components/messages/MessageActionsMenu';
 *    import { VoicePlayer } from './components/messages/VoicePlayer';
 *    import { audioService } from './services/audio.service';
 *    ```
 * 
 * 2. Dans votre formulaire de message, remplacez le bouton "Plus" par :
 *    ```jsx
 *    <MessageActionsMenu
 *      onVoiceRecorded={handleVoiceRecorded}
 *      isMobile={isMobile}
 *    />
 *    ```
 * 
 * 3. Dans votre liste de messages, affichez les vocaux :
 *    ```jsx
 *    {message.audio_url ? (
 *      <VoicePlayer
 *        audioUrl={message.audio_url}
 *        duration={message.audio_duration}
 *        isSender={message.sender_id === currentUserId}
 *      />
 *    ) : (
 *      <div>{message.content}</div>
 *    )}
 *    ```
 * 
 * 4. Exécutez la migration SQL :
 *    - Allez dans Supabase Dashboard > SQL Editor
 *    - Collez le contenu de `supabase/migrations/add_voice_messages.sql`
 *    - Exécutez
 * 
 * 5. Créez le bucket Storage :
 *    - Allez dans Storage > Create bucket
 *    - Name: message-audios
 *    - Public: false
 *    - File size limit: 10 MB
 *    - Allowed MIME types: audio/webm, audio/mp4, audio/ogg
 */

