import type { Project } from '../services/projectService';

interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard component displays an individual project with image, name, description, and a "Read More" button.
 * Implements Requirements 1.2, 1.3 - displays project image, name, and description.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl">
      <div className="aspect-[450/350] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={project.image || 'https://via.placeholder.com/450x350?text=Project+Image'}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/450x350?text=Project+Image';
          }}
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
          {project.name}
        </h3>
        {project.location && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {project.location}
          </div>
        )}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-3">
          {project.description}
        </p>
        <button
          className="inline-flex items-center px-3 py-2 sm:px-4 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={`Read more about ${project.name}`}
        >
          Read More
          <svg
            className="ml-2 w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
