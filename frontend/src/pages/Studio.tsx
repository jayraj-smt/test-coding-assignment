import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { generationService, Generation } from '../services/generationService';
import ImageUpload from '../components/ImageUpload';
import GenerationHistory from '../components/GenerationHistory';
import { motion } from 'framer-motion';

const STYLES = ['Modern', 'Vintage', 'Casual', 'Formal', 'Streetwear'];

// Get backend base URL for image URLs
const getBackendBaseUrl = (): string => {
  // @ts-expect-error - Vite env variables are available at runtime
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace('/api', '');
};

const Studio = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async () => {
    try {
      const recent = await generationService.getRecentGenerations(5);
      setGenerations(recent);
    } catch (err) {
      console.error('Failed to load generations:', err);
    }
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) {
      setError('Please select an image and enter a prompt');
      return;
    }

    setError('');
    setIsGenerating(true);
    setRetryCount(0);

    await attemptGeneration();
  };

  const attemptGeneration = async () => {
    if (!selectedImage) return;

    abortControllerRef.current = new AbortController();

    try {
      await generationService.createGeneration(
        prompt,
        style,
        selectedImage,
        abortControllerRef.current.signal
      );

      setIsGenerating(false);
      setRetryCount(0);
      await loadGenerations();
      setSelectedImage(null);
      setPreviewUrl(null);
      setPrompt('');
    } catch (err: unknown) {
      if (abortControllerRef.current?.signal.aborted) {
        setIsGenerating(false);
        return;
      }

      if (err instanceof Error && err.name === 'CanceledError') {
        setIsGenerating(false);
        return;
      }

      const axiosError = err as { response?: { status: number; data?: { message?: string } } };
      if (
        axiosError.response?.status === 503 ||
        axiosError.response?.data?.message === 'Model overloaded'
      ) {
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          setTimeout(
            () => {
              attemptGeneration();
            },
            Math.pow(2, retryCount) * 1000
          );
        } else {
          setError('Model is overloaded. Please try again later.');
          setIsGenerating(false);
          setRetryCount(0);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
        setIsGenerating(false);
        setRetryCount(0);
      }
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setError('');
    }
  };

  const handleRestoreGeneration = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style);
    // Convert imageUrl to full URL for preview
    const imageUrl = generation.imageUrl.startsWith('http')
      ? generation.imageUrl
      : `${getBackendBaseUrl()}${generation.imageUrl}`;
    setPreviewUrl(imageUrl);
    // Clear selectedImage since we're just previewing, not uploading
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Create New Generation
              </h2>

              <div className="space-y-6">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  previewUrl={previewUrl}
                  disabled={isGenerating}
                />

                <div>
                  <label
                    htmlFor="prompt"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the fashion style you want to generate..."
                    rows={4}
                    className="input-field"
                    disabled={isGenerating}
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Style
                  </label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="input-field"
                    disabled={isGenerating}
                    aria-required="true"
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                    {error}
                    {retryCount > 0 && retryCount < 3 && (
                      <p className="mt-2 text-sm">Retrying... ({retryCount}/3)</p>
                    )}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedImage || !prompt.trim()}
                    className="btn-primary flex-1"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate'
                    )}
                  </button>
                  {isGenerating && (
                    <button onClick={handleAbort} className="btn-secondary">
                      Abort
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <GenerationHistory
              generations={generations}
              onRestore={handleRestoreGeneration}
              isLoading={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Studio;
