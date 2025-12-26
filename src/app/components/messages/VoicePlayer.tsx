import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface VoicePlayerProps {
  audioUrl: string;
  duration: number;
  isSender?: boolean;
}

export function VoicePlayer({ audioUrl, duration, isSender }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Créer l'élément audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Mettre à jour le temps actuel
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    // Quand la lecture se termine
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', onEnded);

    // Créer analyser pour visualisation
    const setupAnalyser = () => {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256;
    };

    // Analyser le niveau audio
    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    // Setup analyser au premier play
    const onFirstPlay = () => {
      if (!audioContextRef.current) {
        setupAnalyser();
        updateAudioLevel();
      }
      audio.removeEventListener('play', onFirstPlay);
    };
    audio.addEventListener('play', onFirstPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onFirstPlay);
      audio.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Formater le temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le pourcentage de progression
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-xl
        ${isSender ? 'bg-[#FACC15]' : 'bg-gray-100'}
        max-w-[280px]
      `}
    >
      {/* Bouton Play/Pause */}
      <Button
        onClick={togglePlay}
        size="sm"
        variant="ghost"
        className={`
          w-10 h-10 rounded-full flex-shrink-0
          ${isSender ? 'bg-white hover:bg-gray-50 text-[#FACC15]' : 'bg-[#FACC15] hover:bg-[#F5C61A] text-white'}
        `}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      {/* Visualisation audio */}
      <div className="flex-1">
        {/* Barres de visualisation */}
        <div className="flex items-center gap-0.5 h-8 mb-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${
                isSender ? 'bg-white' : 'bg-[#FACC15]'
              }`}
              animate={{
                height: isPlaying
                  ? `${Math.max(4, (audioLevel / 255) * 32 * (1 - Math.abs(i - 10) / 10))}px`
                  : i < (progress / 5) ? '16px' : '4px',
                opacity: i < (progress / 5) ? 1 : 0.3
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Temps */}
        <div className={`text-xs ${isSender ? 'text-gray-700' : 'text-gray-600'}`}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Icône Volume */}
      <Volume2
        className={`w-4 h-4 flex-shrink-0 ${
          isSender ? 'text-white' : 'text-gray-400'
        }`}
      />
    </div>
  );
}

