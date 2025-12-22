import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, CheckCircle, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { uploadMultipleImages } from '../../services/upload.service';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

type UploadItem = {
  id: string;
  previewUrl: string;
  remoteUrl?: string;
  status: 'uploading' | 'done' | 'error';
};

const uid = () => Math.random().toString(36).slice(2);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const remoteImages = useMemo(
    () => items.filter(i => i.status === 'done' && i.remoteUrl).map(i => i.remoteUrl!),
    [items]
  );

  useEffect(() => {
    onImagesChange(remoteImages);
  }, [onImagesChange, remoteImages]);

  useEffect(() => {
    return () => {
      items.forEach(i => {
        if (i.previewUrl.startsWith('blob:')) {
          try { URL.revokeObjectURL(i.previewUrl); } catch {}
        }
      });
    };
  }, [items]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    void handleFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    void handleFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleFiles = async (files: File[]) => {
    setError('');

    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Veuillez selectionner uniquement des images.');
      return;
    }

    const tooLarge = imageFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (tooLarge.length > 0) {
      setError(`Image trop volumineuse (max 5MB): ${tooLarge[0].name}`);
    }

    const sizeOk = imageFiles.filter((f) => f.size <= MAX_FILE_SIZE);
    if (sizeOk.length === 0) {
      return;
    }

    const spaceLeft = Math.max(0, maxImages - items.length);
    const selected = sizeOk.slice(0, spaceLeft);
    if (selected.length === 0) {
      setError(`Vous avez deja atteint la limite (${maxImages} images).`);
      return;
    }

    const placeholders: UploadItem[] = selected.map((f) => ({
      id: uid(),
      previewUrl: URL.createObjectURL(f),
      status: 'uploading',
    }));

    setItems(prev => [...prev, ...placeholders]);

    const result = await uploadMultipleImages(selected);
    if (!result.success || !result.urls) {
      setItems(prev => prev.map(i => placeholders.some(p => p.id === i.id) ? { ...i, status: 'error' } : i));
      setError(result.message || "Erreur lors de l'upload des images");
      return;
    }

    setItems(prev => {
      let urlIdx = 0;
      return prev.map(i => {
        const isPlaceholder = placeholders.some(p => p.id === i.id);
        if (!isPlaceholder) return i;
        const remoteUrl = result.urls?.[urlIdx++];
        return remoteUrl ? { ...i, remoteUrl, status: 'done' } : { ...i, status: 'error' };
      });
    });
  };

  const removeImage = (index: number) => {
    setItems(prev => {
      const toRemove = prev[index];
      if (toRemove?.previewUrl?.startsWith('blob:')) {
        try { URL.revokeObjectURL(toRemove.previewUrl); } catch {}
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const previewImages = useMemo(() => items.map(i => i.remoteUrl || i.previewUrl), [items]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          isDragging ? 'border-[#FACC15] bg-[#FACC15]/10' : 'border-gray-300 hover:border-[#FACC15] hover:bg-gray-50'
        }`}
      >
        <input type="file" multiple accept="image/*" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
              isDragging ? 'bg-gradient-to-br from-[#FACC15] to-[#FBBF24]' : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
          >
            <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`} />
          </motion.div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 font-[var(--font-poppins)]">
            {isDragging ? 'Deposez vos photos ici' : 'Ajoutez vos photos'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Glissez-deposez ou cliquez pour selectionner ({items.length}/{maxImages})
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>JPG, PNG jusqu'a 5MB par image</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {previewImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {previewImages.map((image, index) => {
              const item = items[index];
              const isUploading = item?.status === 'uploading';
              const isError = item?.status === 'error';

              return (
                <motion.div
                  key={item?.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square"
                >
                  <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />

                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                        Photo principale
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <ImageIcon className={`w-8 h-8 ${isError ? 'text-red-300' : 'text-white'}`} />
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}