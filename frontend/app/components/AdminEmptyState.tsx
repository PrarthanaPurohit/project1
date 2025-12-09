/**
 * AdminEmptyState component provides consistent empty state messaging for admin pages.
 * Implements Requirements 1.1, 2.1, 3.4, 4.4:
 * - Displays helpful messages when no data is available in admin panel
 * - Consistent empty state experience
 */

interface AdminEmptyStateProps {
  message: string;
}

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return (
    <div style={styles.container}>
      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px',
  },
  message: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
};
