import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Send, X, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
  isMobile?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, onCancel, isMobile }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      stopRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Créer MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Analyser le niveau audio pour l'animation
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();

      // Collecter les données audio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Quand l'enregistrement se termine
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, recordingTime);
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Démarrer le timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // Max 5 minutes
            stopRecording(true);
            return 300;
          }
          return prev + 1;
        });
      }, 1000);

      toast.success('🎤 Enregistrement démarré');
    } catch (error) {
      console.error('Erreur accès micro:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = (send: boolean) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    
    if (!send) {
      audioChunksRef.current = [];
      setRecordingTime(0);
    }
  };

  // Formater le temps (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Annuler l'enregistrement
  const handleCancel = () => {
    stopRecording(false);
    onCancel();
  };

  // Envoyer l'enregistrement
  const handleSend = () => {
    if (recordingTime < 1) {
      toast.error('Enregistrement trop court (min 1 seconde)');
      return;
    }
    stopRecording(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        fixed ${isMobile ? 'inset-0' : 'bottom-20 left-1/2 -translate-x-1/2 w-[400px]'}
        bg-white rounded-2xl shadow-2xl border-2 border-[#FACC15] z-50
        ${isMobile ? '' : 'max-w-[90vw]'}
      `}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#FACC15]" />
            <h3 className="font-semibold text-gray-900">Message vocal</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Visualisation audio */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-1 h-32">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#FACC15] rounded-full"
                animate={{
                  height: isRecording
                    ? `${Math.max(10, (audioLevel / 255) * 100 * (1 - Math.abs(i - 20) / 20))}px`
                    : '10px'
                }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-500">
            {isRecording ? '🔴 Enregistrement en cours...' : 'Prêt à enregistrer'}
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-[#FACC15] hover:bg-[#F5C61A] text-white shadow-lg"
            >
              <Mic className="w-6 h-6" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-12 h-12 rounded-full border-red-500 text-red-500 hover:bg-red-50"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={recordingTime < 1}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse"
              >
                <Square className="w-6 h-6" />
              </Button>

              <Button
                onClick={handleSend}
                disabled={recordingTime < 1}
                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Infos */}
        <div className="mt-4 text-center text-xs text-gray-400">
          {isRecording ? (
            <>Durée max : 5 minutes</>
          ) : (
            <>Cliquez sur 🎤 pour commencer</>
          )}
        </div>
      </div>
    </motion.div>
  );
}

