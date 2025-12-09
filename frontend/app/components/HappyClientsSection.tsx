import { useState, useEffect, useCallback } from 'react';
import { clientService, type Client } from '../services/clientService';
import ClientCard from './ClientCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

/**
 * HappyClientsSection component fetches and displays all client testimonials from the backend.
 * Implements Requirements 2.1, 2.2, 2.3:
 * - Fetches all clients from the backend on page load
 * - Displays clients with image, name, description, and designation
 * - Includes loading state, error handling, retry mechanism, and responsive grid layout
 */
export default function HappyClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load client testimonials. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <section id="clients" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Happy Clients
        </h2>
        <LoadingSpinner message="Loading client testimonials..." />
      </section>
    );
  }

  if (error) {
    return (
      <section id="clients" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Happy Clients
        </h2>
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          title="Failed to Load Client Testimonials"
        />
      </section>
    );
  }

  if (clients.length === 0) {
    return (
      <section id="clients" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Happy Clients
        </h2>
        <EmptyState
          title="No Client Testimonials Yet"
          message="No client testimonials available at the moment. Check back soon!"
          icon="inbox"
        />
      </section>
    );
  }

  return (
    <section id="clients" className="mb-12 sm:mb-16 scroll-mt-20">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
        Happy Clients
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>
    </section>
  );
}
