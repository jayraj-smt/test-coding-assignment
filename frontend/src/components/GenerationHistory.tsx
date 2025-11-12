import { motion } from 'framer-motion';
import { Generation } from '../services/generationService';

interface GenerationHistoryProps {
  generations: Generation[];
  onRestore: (generation: Generation) => void;
  isLoading: boolean;
}

// Get backend base URL (same pattern as service files)
const getBackendBaseUrl = (): string => {
  // @ts-expect-error - Vite env variables are available at runtime
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace('/api', '');
};

const GenerationHistory = ({ generations, onRestore, isLoading }: GenerationHistoryProps) => {
  const getImageUrl = (imageUrl: string): string => {
    // If imageUrl already starts with http, use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // imageUrl already contains /uploads/filename.jpg, so just prepend backend URL
    return `${getBackendBaseUrl()}${imageUrl}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Generations</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : generations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No generations yet. Create your first one!
        </p>
      ) : (
        <div className="space-y-4">
          {generations.map((generation) => (
            <motion.div
              key={generation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => onRestore(generation)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRestore(generation);
                }
              }}
              aria-label={`Restore generation from ${formatDate(generation.createdAt)}`}
            >
              <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={getImageUrl(generation.imageUrl)}
                  alt={generation.prompt}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                {generation.prompt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{generation.style}</span>
                <span>{formatDate(generation.createdAt)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default GenerationHistory;
