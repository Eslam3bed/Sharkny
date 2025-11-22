import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, X } from 'lucide-react';
import { compressImageFile, getFileSizeDisplay, shouldCompressImage, validateImageFile } from '@/lib/imageUtils';
import { useTranslation } from '@/hooks/useTranslation';
import { FunnyProgress } from '@/components/FunnyProgress';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export function ImageUpload({ onImageUpload, isLoading, error }: ImageUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ originalSize: string, compressedSize?: string } | null>(null);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Prevent multiple file uploads per session
    if (hasUploadedFile) {
      return;
    }

    if (!validateImageFile(file)) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    setIsCompressing(true);

    try {
      const originalSize = getFileSizeDisplay(file.size);
      let finalFile = file;
      let compressedSize: string | undefined;

      // Compress if file is large enough to benefit from compression
      if (shouldCompressImage(file)) {
        console.log(`Compressing image: ${originalSize}`);
        finalFile = await compressImageFile(file);
        compressedSize = getFileSizeDisplay(finalFile.size);
        console.log(`Compression complete: ${originalSize} → ${compressedSize}`);
      }

      // Update file info for display
      setFileInfo({ originalSize, compressedSize });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(finalFile);

      // Mark that a file has been uploaded this session
      setHasUploadedFile(true);

      // Call parent handler with compressed file
      onImageUpload(finalFile);
    } catch (error) {
      console.error('Error processing image:', error);
      // If compression fails, still try to use original file if it's small enough
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setFileInfo({ originalSize: getFileSizeDisplay(file.size) });
        setHasUploadedFile(true);
        onImageUpload(file);
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
      // Clear the input immediately after selection to prevent reopening
      if (e.target) e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-0">
      {error && (
        <Alert className="mb-6 border-destructive bg-destructive/10 shadow-lg">
          <AlertDescription className="text-destructive whitespace-pre-line text-center py-3">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Show FunnyProgress when processing */}
      {(isLoading || isCompressing) ? (
        <FunnyProgress isProcessing={isLoading || isCompressing} />
      ) : !preview && !hasUploadedFile ? (
        <div className="space-y-6">
          {/* Single Large Upload Button */}
          <div
            className={`relative border-3 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 touch-target cursor-pointer ${dragActive
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-border hover:border-primary/50 hover:bg-accent/20'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-primary">
                <Camera className="w-full h-full" />
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {t.snapYourReceipt}
                </p>
                <p className="text-base sm:text-lg text-muted-foreground px-2 sm:px-0">
                  {t.tapToPhoto}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 px-2 sm:px-0">
                  {t.supports}
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading || isCompressing}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading || isCompressing}
            />
          </div>

          {/* Alternative Upload Methods */}
          {!(isLoading || isCompressing) && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={triggerFileInput}
                variant="outline"
                size="lg"
                className="gap-3 touch-target flex-1 max-w-40"
              >
                <Upload className="h-5 w-5" />
                {t.gallery}
              </Button>

              <Button
                onClick={triggerCameraInput}
                variant="outline"
                size="lg"
                className="gap-3 touch-target flex-1 max-w-40"
              >
                <Camera className="h-5 w-5" />
                {t.camera}
              </Button>
            </div>
          )}
        </div>
      ) : hasUploadedFile ? (
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
            {t.sessionComplete}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {t.oneFilePerSession}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 touch-target"
          >
            {t.startNewSession}
          </button>
        </div>
      ) : (
        <div className="space-y-6 bounce-in">
          <div className="relative">
            <img
              src={preview || undefined}
              alt="Receipt preview"
              className="w-full max-h-80 object-cover rounded-2xl border-2 border-border shadow-lg"
            />

            {!(isLoading || isCompressing) && (
              <Button
                onClick={clearPreview}
                variant="destructive"
                size="lg"
                className="absolute top-4 right-4 touch-target"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {fileInfo && !isLoading && !isCompressing && (
            <div className="text-center p-4 bg-accent/20 rounded-xl">
              <p className="text-sm font-medium text-accent-foreground">
                📊 File size: {fileInfo.originalSize}
                {fileInfo.compressedSize && (
                  <span className="text-primary ml-2">
                    → {fileInfo.compressedSize} ✨
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}