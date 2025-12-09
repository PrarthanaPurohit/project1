import { useState, useEffect, useCallback } from 'react';
import { projectService, type Project } from '../services/projectService';
import ProjectCard from './ProjectCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

/**
 * ProjectsSection component fetches and displays all projects from the backend.
 * Implements Requirements 1.1, 1.2, 1.3:
 * - Fetches all projects from the backend on page load
 * - Displays projects with image, name, and description
 * - Includes loading state, error handling, retry mechanism, and responsive grid layout
 */
export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <section id="projects" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Our Projects
        </h2>
        <LoadingSpinner message="Loading projects..." />
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Our Projects
        </h2>
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          title="Failed to Load Projects"
        />
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="mb-12 sm:mb-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
          Our Projects
        </h2>
        <EmptyState
          title="No Projects Yet"
          message="No projects available at the moment. Check back soon!"
          icon="document"
        />
      </section>
    );
  }

  return (
    <section id="projects" className="mb-12 sm:mb-16 scroll-mt-20">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
        Our Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
