/**
 * LoadingSpinner component provides a consistent loading indicator across the application.
 * Implements Requirements 1.1, 2.1, 3.4, 4.4:
 * - Provides visual feedback during API calls
 * - Consistent loading experience across all components
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-b-2',
    large: 'h-16 w-16 border-b-3',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 z-50'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      )}
    </div>
  );
}
