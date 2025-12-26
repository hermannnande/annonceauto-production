import { supabase } from '../app/lib/supabase';

/**
 * Service pour gérer l'upload et le téléchargement de messages vocaux
 */

const BUCKET_NAME = 'message-audios';

export const audioService = {
  /**
   * Upload un fichier audio vers Supabase Storage
   * @param audioBlob - Le blob audio à uploader
   * @param userId - L'ID de l'utilisateur qui envoie le message
   * @returns L'URL publique du fichier uploadé
   */
  async uploadAudio(audioBlob: Blob, userId: string): Promise<string> {
    try {
      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${userId}/${timestamp}-${randomString}.webm`;

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erreur upload audio:', error);
        throw new Error(`Erreur d'upload: ${error.message}`);
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erreur uploadAudio:', error);
      throw error;
    }
  },

  /**
   * Supprime un fichier audio
   * @param audioUrl - L'URL du fichier à supprimer
   */
  async deleteAudio(audioUrl: string): Promise<void> {
    try {
      // Extraire le path du fichier depuis l'URL
      const urlParts = audioUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length < 2) {
        throw new Error('URL audio invalide');
      }
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Erreur suppression audio:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur deleteAudio:', error);
      throw error;
    }
  },

  /**
   * Récupère un fichier audio (pour download)
   * @param audioUrl - L'URL du fichier
   * @returns Le blob audio
   */
  async downloadAudio(audioUrl: string): Promise<Blob> {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Erreur téléchargement audio');
      }
      return await response.blob();
    } catch (error) {
      console.error('Erreur downloadAudio:', error);
      throw error;
    }
  },

  /**
   * Convertit un blob audio en format compatible navigateur
   * @param audioBlob - Le blob audio source
   * @returns Le blob converti
   */
  async convertAudioFormat(audioBlob: Blob): Promise<Blob> {
    // Pour l'instant, on retourne le blob tel quel
    // À l'avenir, on pourrait ajouter une conversion via ffmpeg.wasm
    return audioBlob;
  },

  /**
   * Calcule la durée d'un fichier audio
   * @param audioBlob - Le blob audio
   * @returns La durée en secondes
   */
  async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(audioBlob);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(Math.floor(audio.duration));
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Erreur lecture metadata audio'));
      });

      audio.src = url;
    });
  },

  /**
   * Valide un fichier audio
   * @param audioBlob - Le blob à valider
   * @returns true si valide, false sinon
   */
  async validateAudio(audioBlob: Blob): Promise<{ valid: boolean; error?: string }> {
    // Vérifier la taille (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (audioBlob.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'Fichier trop volumineux (max 10MB)',
      };
    }

    // Vérifier le type MIME
    const validTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg'];
    if (!validTypes.includes(audioBlob.type)) {
      return {
        valid: false,
        error: 'Format audio non supporté',
      };
    }

    // Vérifier la durée (max 5 minutes)
    try {
      const duration = await this.getAudioDuration(audioBlob);
      if (duration > 300) {
        return {
          valid: false,
          error: 'Durée maximale 5 minutes',
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: 'Impossible de lire le fichier audio',
      };
    }

    return { valid: true };
  },
};

