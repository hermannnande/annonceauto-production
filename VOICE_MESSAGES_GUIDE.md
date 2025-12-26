# 🎤 SYSTÈME DE MESSAGES VOCAUX - GUIDE COMPLET

## 📋 Vue d'ensemble

Système complet de messages vocaux pour la messagerie AnnonceAuto.ci avec :
- ✅ Enregistrement audio avec visualisation en temps réel
- ✅ Lecteur audio avec barre de progression animée
- ✅ Upload sécurisé vers Supabase Storage
- ✅ Interface mobile et desktop
- ✅ Durée max 5 minutes, taille max 10MB

---

## 🗂️ Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/app/components/messages/VoiceRecorder.tsx` | Composant d'enregistrement audio avec visualisation |
| `src/app/components/messages/VoicePlayer.tsx` | Lecteur de messages vocaux avec animation |
| `src/app/components/messages/MessageActionsMenu.tsx` | Menu d'actions avec bouton vocal |
| `src/services/audio.service.ts` | Service upload/validation audio |
| `supabase/migrations/add_voice_messages.sql` | Migration SQL pour colonnes audio |
| `src/app/pages/ExampleVoiceMessaging.tsx` | Exemple d'intégration |

---

## 🚀 Installation (5 étapes)

### Étape 1 : Migration SQL

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Exécutez le contenu de `supabase/migrations/add_voice_messages.sql`
3. Vérifiez que les colonnes `audio_url` et `audio_duration` ont été ajoutées à la table `messages`

```sql
-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND column_name IN ('audio_url', 'audio_duration');
```

### Étape 2 : Créer le bucket Supabase Storage

1. Allez dans **Storage** → **Create bucket**
2. Configurez :
   - **Name**: `message-audios`
   - **Public**: ❌ **Non** (sécurisé)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: 
     - `audio/webm`
     - `audio/mp4`
     - `audio/ogg`
     - `audio/mpeg`
3. Cliquez sur **Save**

### Étape 3 : Vérifier les permissions (RLS)

Les politiques RLS sont automatiquement créées par la migration SQL :

```sql
-- Vérifier les politiques
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%audio%';
```

### Étape 4 : Intégrer dans votre page de messagerie

Voir `src/app/pages/ExampleVoiceMessaging.tsx` pour un exemple complet.

**Code minimal :**

```tsx
import { MessageActionsMenu } from './components/messages/MessageActionsMenu';
import { VoicePlayer } from './components/messages/VoicePlayer';
import { audioService } from './services/audio.service';

// Dans votre composant
const handleVoiceRecorded = async (audioBlob: Blob, duration: number) => {
  // 1. Upload
  const audioUrl = await audioService.uploadAudio(audioBlob, userId);
  
  // 2. Sauvegarder en BDD
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: userId,
    receiver_id: receiverId,
    content: '🎤 Message vocal',
    audio_url: audioUrl,
    audio_duration: duration,
  });
};

// Dans le formulaire
<MessageActionsMenu
  onVoiceRecorded={handleVoiceRecorded}
  isMobile={isMobile}
/>

// Dans la liste de messages
{message.audio_url ? (
  <VoicePlayer
    audioUrl={message.audio_url}
    duration={message.audio_duration}
    isSender={isSender}
  />
) : (
  <div>{message.content}</div>
)}
```

### Étape 5 : Tester

1. Allez sur votre page de messagerie
2. Cliquez sur le bouton **"➕ Plus"**
3. Sélectionnez **"🎤 Message vocal"**
4. Autorisez l'accès au microphone
5. Enregistrez un message
6. Vérifiez qu'il s'affiche avec le lecteur audio

---

## 🎨 Fonctionnalités

### VoiceRecorder (Enregistrement)

✅ **Interface intuitive** :
- Bouton microphone pour démarrer
- Visualisation audio en temps réel (40 barres animées)
- Timer affiché (MM:SS)
- Boutons Annuler/Arrêter/Envoyer

✅ **Contraintes** :
- Durée min : 1 seconde
- Durée max : 5 minutes (300s)
- Format : `audio/webm` (optimisé web)
- Auto-stop à 5 minutes

✅ **Responsive** :
- **Mobile** : Plein écran avec fond blanc
- **Desktop** : Popup centrée 400px

### VoicePlayer (Lecture)

✅ **Lecteur professionnel** :
- Bouton Play/Pause
- Visualisation audio animée (20 barres)
- Progression temps réel (MM:SS / MM:SS)
- Icône volume

✅ **Design adaptatif** :
- **Sender** : Fond jaune `#FACC15`
- **Receiver** : Fond gris `bg-gray-100`
- Largeur max : 280px

### audioService (Gestion)

✅ **Fonctions disponibles** :

| Fonction | Description |
|----------|-------------|
| `uploadAudio(blob, userId)` | Upload vers Supabase Storage |
| `deleteAudio(audioUrl)` | Supprime un fichier audio |
| `downloadAudio(audioUrl)` | Télécharge un audio |
| `getAudioDuration(blob)` | Calcule la durée |
| `validateAudio(blob)` | Valide taille/format/durée |

✅ **Validation automatique** :
- Taille max : 10MB
- Formats : webm, mp4, ogg, mpeg
- Durée max : 5 minutes

---

## 📊 Structure de données

### Table `messages`

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT,
  
  -- 🆕 Colonnes audio
  audio_url TEXT,              -- URL Supabase Storage
  audio_duration INTEGER DEFAULT 0,  -- Durée en secondes
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Bucket `message-audios`

Structure des fichiers :
```
message-audios/
├── {userId}/
│   ├── 1234567890-abc123.webm
│   ├── 1234567891-def456.webm
│   └── ...
```

---

## 🔐 Sécurité

### RLS Policies (Row Level Security)

1. **Upload** : Seul l'utilisateur peut uploader dans son dossier
```sql
CREATE POLICY "Users can upload audio for own messages"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-audios'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

2. **Lecture** : Seuls les participants de la conversation peuvent lire
```sql
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
```

### Validation côté client

```typescript
// Vérifie automatiquement :
- Taille <= 10MB
- Format audio valide
- Durée <= 5 minutes
- Métadonnées lisibles
```

---

## 🎯 Cas d'usage

### 1. Message vocal dans conversation vendeur/acheteur

```tsx
// Page VehicleDetailPage.tsx (bouton "Contacter")
const handleSendVoiceMessage = async (blob, duration) => {
  const audioUrl = await audioService.uploadAudio(blob, currentUser.id);
  
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: currentUser.id,
    receiver_id: vendor.id,
    listing_id: vehicleId,
    content: '🎤 Message vocal',
    audio_url: audioUrl,
    audio_duration: duration,
  });
};
```

### 2. Réponse rapide par vocal (vendeur)

```tsx
// Dashboard vendeur messages
<VoicePlayer
  audioUrl={message.audio_url}
  duration={message.audio_duration}
  isSender={message.sender_id === currentUser.id}
/>
```

---

## 🐛 Dépannage

### Problème : "Impossible d'accéder au microphone"

**Solution** :
1. Vérifiez que le site est en **HTTPS** (obligatoire pour `getUserMedia`)
2. Autorisez l'accès micro dans les paramètres du navigateur
3. Sur mobile : Testez sur Chrome/Safari (Firefox peut avoir des bugs)

### Problème : "Erreur d'upload"

**Solution** :
1. Vérifiez que le bucket `message-audios` existe
2. Vérifiez les variables d'environnement Supabase :
   ```env
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Vérifiez les RLS policies dans Supabase

### Problème : "Le lecteur ne lit pas l'audio"

**Solution** :
1. Vérifiez que `audio_url` est une URL complète
2. Testez l'URL directement dans le navigateur
3. Vérifiez les CORS du bucket (normalement auto-configurés)

---

## 📱 Compatibilité navigateurs

| Navigateur | Desktop | Mobile | Notes |
|-----------|---------|--------|-------|
| Chrome | ✅ | ✅ | Parfait |
| Firefox | ✅ | ⚠️ | Peut avoir des bugs audio |
| Safari | ✅ | ✅ | Parfait |
| Edge | ✅ | ✅ | Parfait |

---

## 🚀 Prochaines améliorations possibles

- [ ] Conversion audio vers format universel (via ffmpeg.wasm)
- [ ] Transcription automatique (via Whisper API)
- [ ] Compression audio avant upload
- [ ] Waveform précalculée (stockée en metadata)
- [ ] Marquage "lu/non lu" pour audios
- [ ] Téléchargement audio pour sauvegarde locale

---

## 💡 Exemple complet

Voir `src/app/pages/ExampleVoiceMessaging.tsx` pour un exemple fonctionnel complet avec :
- ✅ Upload audio
- ✅ Affichage messages texte + vocal
- ✅ Gestion erreurs
- ✅ Toast notifications
- ✅ État de chargement

---

## 🎉 Résumé

Vous avez maintenant un système vocal complet et sécurisé ! 🚀

**Pour déployer :**
1. ✅ Exécuter la migration SQL
2. ✅ Créer le bucket Storage
3. ✅ Intégrer les composants
4. ✅ Tester en local
5. ✅ Déployer sur Vercel

**Support :** Pour toute question, consultez :
- `ExampleVoiceMessaging.tsx` (exemple d'intégration)
- `audio.service.ts` (documentation des fonctions)
- Supabase Docs : https://supabase.com/docs/guides/storage

