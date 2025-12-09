/**
 * AdminLoadingSpinner component provides consistent loading indicators for admin pages.
 * Implements Requirements 1.1, 2.1, 3.4, 4.4:
 * - Provides visual feedback during admin API calls
 * - Consistent loading experience across admin panel
 */

interface AdminLoadingSpinnerProps {
  message?: string;
}

export default function AdminLoadingSpinner({ message = 'Loading...' }: AdminLoadingSpinnerProps) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '40px',
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    marginTop: '16px',
    color: '#7f8c8d',
    fontSize: '16px',
  },
};

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
