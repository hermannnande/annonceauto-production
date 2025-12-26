import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { MessageActionsMenu } from '../components/messages/MessageActionsMenu';
import { VoicePlayer } from '../components/messages/VoicePlayer';
import { audioService } from '../../services/audio.service';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import { motion } from 'motion/react';

interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  listing?: {
    title: string;
    images: string[];
  };
  buyer_profile?: {
    full_name: string;
    avatar_url?: string;
  };
  seller_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  audio_url?: string;
  audio_duration?: number;
  attachment_url?: string;
  created_at: string;
  is_read: boolean;
}

export function VendorMessages() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger l'utilisateur actuel
  useEffect(() => {
    loadCurrentUser();
  }, []);

  // Charger les conversations
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      
      // S'abonner aux nouvelles conversations
      const channel = supabase
        .channel('conversations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `seller_id=eq.${currentUser.id}`,
        }, () => {
          loadConversations();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser]);

  // Charger les messages de la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      
      // S'abonner aux nouveaux messages
      const channel = supabase
        .channel(`messages:${selectedConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  // Si conversationId dans l'URL, sélectionner cette conversation
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [conversationId, conversations]);

  // Scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title, images),
          buyer_profile:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
          seller_profile:profiles!conversations_seller_id_fkey(full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Marquer comme lus
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convId)
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    try {
      setIsSending(true);
      
      const receiverId = selectedConversation.seller_id === currentUser.id
        ? selectedConversation.buyer_id
        : selectedConversation.seller_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: newMessage,
        });

      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceRecorded = async (audioBlob: Blob, duration: number) => {
    if (!selectedConversation) return;

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
      const audioUrl = await audioService.uploadAudio(audioBlob, currentUser.id);

      // Insérer le message
      const receiverId = selectedConversation.seller_id === currentUser.id
        ? selectedConversation.buyer_id
        : selectedConversation.seller_id;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: '🎤 Message vocal',
          audio_url: audioUrl,
          audio_duration: duration,
        });

      if (error) throw error;
      
      toast.success('✅ Message vocal envoyé !');
    } catch (error) {
      console.error('Erreur envoi vocal:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    if (conversation.seller_id === currentUser?.id) {
      return {
        name: conversation.buyer_profile?.full_name || 'Acheteur',
        avatar: conversation.buyer_profile?.avatar_url,
      };
    }
    return {
      name: conversation.seller_profile?.full_name || 'Vendeur',
      avatar: conversation.seller_profile?.avatar_url,
    };
  };

  return (
    <DashboardLayout userType="vendor">
      <div className="flex h-[calc(100vh-120px)] bg-gray-50">
        {/* Liste des conversations */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 bg-white border-r border-gray-200 flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <p className="text-sm text-gray-500">{conversations.length} conversation(s)</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Chargement...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Aucune conversation</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      navigate(`/dashboard/vendeur/messages/${conv.id}`);
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-[#FACC15]/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.name} />
                        ) : (
                          <div className="w-full h-full bg-[#FACC15] flex items-center justify-center text-white font-semibold">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{otherUser.name}</p>
                        <p className="text-sm text-gray-500 truncate">{conv.listing?.title || 'Annonce'}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => {
                  setSelectedConversation(null);
                  navigate('/dashboard/vendeur/messages');
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar className="w-10 h-10">
                {getOtherUser(selectedConversation).avatar ? (
                  <img src={getOtherUser(selectedConversation).avatar} alt="" />
                ) : (
                  <div className="w-full h-full bg-[#FACC15] flex items-center justify-center text-white font-semibold">
                    {getOtherUser(selectedConversation).name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">{getOtherUser(selectedConversation).name}</p>
                <p className="text-sm text-gray-500">{selectedConversation.listing?.title}</p>
              </div>
              
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isSender = message.sender_id === currentUser?.id;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
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
                          px-4 py-2 rounded-2xl max-w-[70%] break-words
                          ${isSender
                            ? 'bg-[#FACC15] text-white'
                            : 'bg-gray-100 text-gray-900'
                          }
                        `}
                      >
                        {message.content}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Menu d'actions avec vocal */}
                <MessageActionsMenu
                  onVoiceRecorded={handleVoiceRecorded}
                  uploading={isUploadingAudio}
                  isMobile={window.innerWidth < 768}
                  fileInputRef={fileInputRef}
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                />

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez un message..."
                  disabled={isSending || isUploadingAudio}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent disabled:opacity-50"
                />

                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSending || isUploadingAudio}
                  className="bg-[#FACC15] hover:bg-[#F5C61A] text-white px-6 py-3 rounded-full disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Placeholder quand aucune conversation sélectionnée */
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm">pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

