import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, CheckCircle, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { uploadService } from '../../services/upload.service';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // On ne compte que les images distantes pour l'affichage
  const remoteImages = images.filter((u) => /^https?:\/\//i.test(u));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const tooLarge = imageFiles.find((f) => f.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setUploadError(`Image trop volumineuse (max 5MB): ${tooLarge.name}`);
      setTimeout(() => setUploadError(''), 6000);
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      // On ne dépasse pas maxImages
      const remaining = Math.max(0, maxImages - images.length);
      const toUpload = imageFiles.slice(0, remaining);

      for (const file of toUpload) {
        // preview immédiat (local), remplacé ensuite par l'URL Cloudinary
        const previewUrl = URL.createObjectURL(file);

        setImages(prev => {
          const next = [...prev, previewUrl].slice(0, maxImages);
          // IMPORTANT: on ne remonte que des URLs distantes au parent
          onImagesChange(next.filter((u) => /^https?:\/\//i.test(u)));
          return next;
        });

        try {
          const result = await uploadService.uploadImage(file);
          
          if (!result.success || !result.url) {
            throw new Error(result.message || 'Upload echoue');
          }

          setImages(prev => {
            const next = [...prev];
            const idx = next.indexOf(previewUrl);
            if (idx !== -1) next[idx] = result.url!;
            // Maintenant on remonte la nouvelle URL distante
            onImagesChange(next.filter((u) => /^https?:\/\//i.test(u)));
            return next;
          });
        } catch (e) {
          // En cas d'échec, on retire le preview (sinon on enverrait une URL locale non valable)
          setImages(prev => {
            const next = prev.filter((u) => u !== previewUrl);
            onImagesChange(next.filter((u) => /^https?:\/\//i.test(u)));
            return next;
          });
          throw e;
        } finally {
          URL.revokeObjectURL(previewUrl);
        }
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Erreur lors de l\'upload des images');
      setTimeout(() => setUploadError(''), 6000);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      onImagesChange(newImages.filter((u) => /^https?:\/\//i.test(u)));
      return newImages;
    });
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{uploadError}</span>
        </div>
      )}

      {/* Upload Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          isDragging
            ? 'border-[#FACC15] bg-[#FACC15]/10'
            : 'border-gray-300 hover:border-[#FACC15] hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ y: isDragging ? -10 : 0 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
              isDragging
                ? 'bg-gradient-to-br from-[#FACC15] to-[#FBBF24]'
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            ) : (
              <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`} />
            )}
          </motion.div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 font-[var(--font-poppins)]">
            {isUploading ? 'Upload en cours...' : (isDragging ? 'Déposez vos photos ici' : 'Ajoutez vos photos')}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Glissez-déposez ou cliquez pour sélectionner ({remoteImages.length}/{maxImages})
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>JPG, PNG jusqu'a 5MB par image</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(images.length / maxImages) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24]"
          />
        </div>
      </motion.div>

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square"
              >
                <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* First Image Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <CheckCircle className="w-3 h-3" />
                      Photo principale
                    </div>
                  )}

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4 text-white" />
                  </motion.button>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
