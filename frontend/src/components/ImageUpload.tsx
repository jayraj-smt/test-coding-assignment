import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { resizeImage } from '../utils/imageResize';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

const ImageUpload = ({ onImageSelect, previewUrl, disabled = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Only JPEG and PNG images are allowed');
      return;
    }

    try {
      const resizedFile = await resizeImage(file, 1920);
      onImageSelect(resizedFile);
    } catch (error) {
      console.error('Error resizing image:', error);
      onImageSelect(file);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Upload Image (max 10MB, JPEG/PNG)
      </label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!disabled ? handleClick : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label="Upload image"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          aria-label="File input"
        />
        {previewUrl ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                  onImageSelect(null);
                }
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              disabled={disabled}
            >
              Remove
            </button>
          </motion.div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
