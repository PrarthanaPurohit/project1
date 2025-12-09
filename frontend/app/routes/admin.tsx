import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import type { Route } from './+types/admin';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Admin Dashboard - Showcase Platform' },
    { name: 'description', content: 'Admin panel dashboard' },
  ];
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div style={styles.dashboard}>
          <h2 style={styles.title}>Dashboard</h2>
          <p style={styles.welcomeText}>
            Welcome to the admin panel. Use the sidebar to navigate between different sections.
          </p>
          
          <div style={styles.cardsContainer}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🎨</div>
              <h3 style={styles.cardTitle}>Projects</h3>
              <p style={styles.cardDescription}>
                Manage your portfolio projects
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Clients</h3>
              <p style={styles.cardDescription}>
                Manage client testimonials
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>📧</div>
              <h3 style={styles.cardTitle}>Contacts</h3>
              <p style={styles.cardDescription}>
                View contact form submissions
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>📬</div>
              <h3 style={styles.cardTitle}>Subscriptions</h3>
              <p style={styles.cardDescription}>
                Manage newsletter subscriptions
              </p>
            </div>
          </div>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Getting Started</h3>
            <p style={styles.infoText}>
              Use the navigation sidebar on the left to access different sections of the admin panel:
            </p>
            <ul style={styles.list}>
              <li><strong>Projects:</strong> Add, edit, and delete portfolio projects</li>
              <li><strong>Clients:</strong> Manage client testimonials and feedback</li>
              <li><strong>Contacts:</strong> View and manage contact form submissions</li>
              <li><strong>Subscriptions:</strong> View and manage newsletter subscriptions</li>
            </ul>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = {
  dashboard: {
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    textAlign: 'center' as const,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#7f8c8d',
    margin: 0,
  },
  infoBox: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  infoText: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '15px',
  },
  list: {
    paddingLeft: '20px',
    lineHeight: '1.8',
    color: '#555',
  },
};
