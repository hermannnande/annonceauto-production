# 🎤 DÉMARRAGE RAPIDE - MESSAGES VOCAUX

## ⚡ Configuration en 3 minutes

### 1️⃣ Migration SQL (30 secondes)

```bash
# Allez sur Supabase Dashboard → SQL Editor
# Exécutez ce script :
```

```sql
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS audio_duration INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_messages_audio_url 
ON messages(audio_url) WHERE audio_url IS NOT NULL;
```

### 2️⃣ Créer le bucket Storage (1 minute)

1. **Supabase Dashboard** → **Storage** → **Create bucket**
2. Configurez :
   - Name: `message-audios`
   - Public: ❌ **Non**
   - File size limit: **10 MB**
   - Allowed types: `audio/webm, audio/mp4, audio/ogg`
3. **Save**

### 3️⃣ Intégrer dans votre code (1 minute)

```tsx
import { MessageActionsMenu } from './components/messages/MessageActionsMenu';
import { VoicePlayer } from './components/messages/VoicePlayer';
import { audioService } from './services/audio.service';

// Fonction d'upload
const handleVoiceRecorded = async (blob: Blob, duration: number) => {
  const audioUrl = await audioService.uploadAudio(blob, userId);
  await supabase.from('messages').insert({
    conversation_id: convId,
    sender_id: userId,
    receiver_id: receiverId,
    content: '🎤 Message vocal',
    audio_url: audioUrl,
    audio_duration: duration,
  });
};

// Dans votre formulaire
<MessageActionsMenu
  onVoiceRecorded={handleVoiceRecorded}
  isMobile={isMobile}
/>

// Dans vos messages
{message.audio_url && (
  <VoicePlayer
    audioUrl={message.audio_url}
    duration={message.audio_duration}
    isSender={message.sender_id === userId}
  />
)}
```

---

## ✅ C'est tout ! Testez maintenant :

1. Ouvrez votre messagerie
2. Cliquez sur **"➕ Plus"** → **"🎤 Message vocal"**
3. Enregistrez un message
4. Envoyez !

---

## 📚 Documentation complète

Voir `VOICE_MESSAGES_GUIDE.md` pour :
- Détails techniques
- Sécurité RLS
- Cas d'usage avancés
- Dépannage

---

## 🎉 Fonctionnalités disponibles

✅ Enregistrement avec visualisation temps réel  
✅ Lecteur audio professionnel  
✅ Upload sécurisé vers Supabase  
✅ Max 5 minutes, 10MB  
✅ Mobile + Desktop  
✅ Validation automatique  

**Bon vocal ! 🎤**

