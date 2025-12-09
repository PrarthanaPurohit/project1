import type { Client } from '../services/clientService';

interface ClientCardProps {
  client: Client;
}

/**
 * ClientCard component renders an individual client testimonial.
 * Implements Requirements 2.2, 2.3:
 * - Displays client image, name, description, and designation
 * - Renders all associated client information
 */
export default function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">
      <div className="aspect-[450/350] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={client.image}
          alt={client.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          srcSet={`${client.image} 1x`}
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {client.name}
        </h3>
        <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 sm:mb-3">
          {client.designation}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          {client.description}
        </p>
      </div>
    </div>
  );
}
