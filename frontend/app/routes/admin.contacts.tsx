import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { contactService, type ContactSubmission } from '../services/contactService';
import type { Route } from './+types/admin.contacts';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import AdminLoadingSpinner from '../components/AdminLoadingSpinner';
import AdminEmptyState from '../components/AdminEmptyState';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Contact Submissions - Admin Panel' },
    { name: 'description', content: 'View contact submissions' },
  ];
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data);
      setFilteredContacts(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch contact submissions';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    // Filter contacts based on search term
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = contacts.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.mobileNumber.includes(term) ||
          contact.city.toLowerCase().includes(term)
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      await contactService.deleteContact(id);
      toast.success('Contact submission deleted successfully!');
      await fetchContacts();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete contact submission';
      setError(errorMsg);
      toast.error(errorMsg);
    }
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
          <h2 style={styles.title}>Contact Submissions</h2>
          <p style={styles.description}>
            View and manage contact form submissions from visitors
          </p>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by name, email, phone, or city..."
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
          </div>

          {/* Contacts Table */}
          <div style={styles.tableContainer}>
            {loading ? (
              <AdminLoadingSpinner message="Loading contact submissions..." />
            ) : filteredContacts.length === 0 ? (
              <AdminEmptyState 
                message={searchTerm
                  ? 'No contact submissions match your search.'
                  : 'No contact submissions yet.'}
              />
            ) : (
              <>
                <div style={styles.tableHeader}>
                  <span style={styles.resultCount}>
                    Showing {filteredContacts.length} of {contacts.length} submissions
                  </span>
                </div>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Full Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Mobile Number</th>
                        <th style={styles.th}>City</th>
                        <th style={styles.th}>Submitted At</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr key={contact._id} style={styles.tr}>
                          <td style={styles.td}>{contact.fullName}</td>
                          <td style={styles.td}>
                            <a
                              href={`mailto:${contact.email}`}
                              style={styles.emailLink}
                            >
                              {contact.email}
                            </a>
                          </td>
                          <td style={styles.td}>
                            <a
                              href={`tel:${contact.mobileNumber}`}
                              style={styles.phoneLink}
                            >
                              {contact.mobileNumber}
                            </a>
                          </td>
                          <td style={styles.td}>{contact.city}</td>
                          <td style={styles.td}>{formatDate(contact.submittedAt)}</td>
                          <td style={styles.td}>
                            <button
                              onClick={() => handleDelete(contact._id)}
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
  },
  searchInput: {
    flex: 1,
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
    minWidth: '800px',
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
  phoneLink: {
    color: '#3498db',
    textDecoration: 'none',
    transition: 'color 0.2s',
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
