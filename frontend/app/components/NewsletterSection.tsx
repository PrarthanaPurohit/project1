import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { newsletterService } from '../services/newsletterService';
import { useToast } from '../hooks/useToast';
import ToastContainer from './ToastContainer';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await newsletterService.subscribe(email);
      
      // Success - clear form and show success toast
      setEmail('');
      toast.success(response.message || 'Thank you for subscribing to our newsletter!');
    } catch (error: any) {
      // Error - show error toast
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 sm:p-8 shadow-md">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Stay updated with our latest projects and news
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="newsletter-email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="email"
                id="newsletter-email"
                name="email"
                value={email}
                onChange={handleChange}
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-white`}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-lg font-medium text-white transition-colors whitespace-nowrap ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
                }`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
