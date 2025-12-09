import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { newsletterService, type NewsletterSubscription } from '../services/newsletterService';
import type { Route } from './+types/admin.subscriptions';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import AdminLoadingSpinner from '../components/AdminLoadingSpinner';
import AdminEmptyState from '../components/AdminEmptyState';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Newsletter Subscriptions - Admin Panel' },
    { name: 'description', content: 'View newsletter subscriptions' },
  ];
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await newsletterService.getAllSubscriptions();
      setSubscriptions(data);
      setFilteredSubscriptions(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch newsletter subscriptions';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    // Filter subscriptions based on search term
    if (searchTerm.trim() === '') {
      setFilteredSubscriptions(subscriptions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = subscriptions.filter((subscription) =>
        subscription.email.toLowerCase().includes(term)
      );
      setFilteredSubscriptions(filtered);
    }
  }, [searchTerm, subscriptions]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await newsletterService.deleteSubscription(id);
      toast.success('Subscription deleted successfully!');
      await fetchSubscriptions();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete subscription';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Email', 'Subscribed At', 'Status'];
    const rows = filteredSubscriptions.map((sub) => [
      sub.email,
      formatDate(sub.subscribedAt),
      sub.isActive ? 'Active' : 'Inactive',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
        <div>
          <h2 style={styles.title}>Newsletter Subscriptions</h2>
          <p style={styles.description}>
            View and manage newsletter email subscriptions
          </p>

          {/* Search and Export Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={styles.clearButton}
              >
                Clear
              </button>
            )}
            {filteredSubscriptions.length > 0 && (
              <button
                onClick={handleExportCSV}
                style={styles.exportButton}
              >
                Export to CSV
              </button>
            )}
          </div>

          {/* Subscriptions Table */}
          <div style={styles.tableContainer}>
            {loading ? (
              <AdminLoadingSpinner message="Loading newsletter subscriptions..." />
            ) : filteredSubscriptions.length === 0 ? (
              <AdminEmptyState 
                message={searchTerm
                  ? 'No subscriptions match your search.'
                  : 'No newsletter subscriptions yet.'}
              />
            ) : (
              <>
                <div style={styles.tableHeader}>
                  <span style={styles.resultCount}>
                    Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
                  </span>
                </div>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Email Address</th>
                        <th style={styles.th}>Subscribed At</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription._id} style={styles.tr}>
                          <td style={styles.td}>
                            <a
                              href={`mailto:${subscription.email}`}
                              style={styles.emailLink}
                            >
                              {subscription.email}
                            </a>
                          </td>
                          <td style={styles.td}>{formatDate(subscription.subscribedAt)}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                ...(subscription.isActive
                                  ? styles.statusActive
                                  : styles.statusInactive),
                              }}
                            >
                              {subscription.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => handleDelete(subscription._id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = {
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    flex: 1,
    minWidth: '250px',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    color: '#2c3e50',
    backgroundColor: 'white',
  },
  clearButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#7f8c8d',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  exportButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px 30px',
    borderBottom: '1px solid #e0e0e0',
  },
  resultCount: {
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#7f8c8d',
    fontSize: '16px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#7f8c8d',
    fontSize: '16px',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '600px',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e0e0e0',
    whiteSpace: 'nowrap' as const,
  },
  tr: {
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#2c3e50',
    verticalAlign: 'middle' as const,
  },
  emailLink: {
    color: '#3498db',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  statusBadge: {
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '12px',
    display: 'inline-block',
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  deleteButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap' as const,
  },
};
