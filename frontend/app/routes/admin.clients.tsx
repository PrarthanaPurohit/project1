import { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { clientService, type Client } from '../services/clientService';
import type { Route } from './+types/admin.clients';
import Cropper, { type ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import AdminLoadingSpinner from '../components/AdminLoadingSpinner';
import AdminEmptyState from '../components/AdminEmptyState';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Client Management - Admin Panel' },
    { name: 'description', content: 'Manage clients' },
  ];
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    designation: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Edit state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clientsListRef = useRef<HTMLDivElement>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientService.getAdminClients();
      setClients(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch clients';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (formErrors.image) {
        setFormErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        width: 450,
        height: 350,
      }).toBlob((blob) => {
        if (blob) {
          setCroppedImage(blob);
          setShowCropper(false);
          toast.success('Image cropped successfully');
        }
      });
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Client name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Client description is required';
    }
    
    if (!formData.designation.trim()) {
      errors.designation = 'Client designation is required';
    }
    
    if (!editingClient && !croppedImage) {
      errors.image = 'Client image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('designation', formData.designation.trim());
      
      if (croppedImage) {
        formDataToSend.append('image', croppedImage, imageFile?.name || 'client.jpg');
      }
      
      if (editingClient) {
        await clientService.updateClient(editingClient._id, formDataToSend);
        toast.success('Client updated successfully!');
      } else {
        await clientService.createClient(formDataToSend);
        toast.success('Client created successfully!');
      }
      
      // Reset form
      setFormData({ name: '', description: '', designation: '' });
      setImageFile(null);
      setImageSrc(null);
      setCroppedImage(null);
      setEditingClient(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh clients list
      await fetchClients();
      
      // Scroll to clients list to show the new/updated client
      setTimeout(() => {
        clientsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save client';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      description: client.description,
      designation: client.designation,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setFormData({ name: '', description: '', designation: '' });
    setImageFile(null);
    setImageSrc(null);
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }
    
    try {
      await clientService.deleteClient(id);
      toast.success('Client deleted successfully!');
      await fetchClients();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete client';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
        <div>
          <h2 style={styles.title}>Client Management</h2>
          <p style={styles.description}>
            Add, edit, and manage your client testimonials
          </p>

          {/* Add/Edit Client Form */}
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Client Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(formErrors.name ? styles.inputError : {}),
                  }}
                  placeholder="Enter client name"
                />
                {formErrors.name && (
                  <span style={styles.errorText}>{formErrors.name}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Client Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(formErrors.designation ? styles.inputError : {}),
                  }}
                  placeholder="Enter client designation (e.g., CEO, Manager)"
                />
                {formErrors.designation && (
                  <span style={styles.errorText}>{formErrors.designation}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Client Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    ...styles.textarea,
                    ...(formErrors.description ? styles.inputError : {}),
                  }}
                  placeholder="Enter client testimonial or description"
                  rows={4}
                />
                {formErrors.description && (
                  <span style={styles.errorText}>{formErrors.description}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Client Image * {editingClient && '(Leave empty to keep current image)'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    ...styles.fileInput,
                    ...(formErrors.image ? styles.inputError : {}),
                  }}
                />
                {formErrors.image && (
                  <span style={styles.errorText}>{formErrors.image}</span>
                )}
                {croppedImage && (
                  <div style={styles.imagePreview}>
                    <p style={styles.previewText}>✓ Image cropped and ready</p>
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...styles.submitButton,
                    ...(submitting ? styles.buttonDisabled : {}),
                  }}
                >
                  {submitting ? 'Saving...' : editingClient ? 'Update Client' : 'Add Client'}
                </button>
                {editingClient && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Image Cropper Modal */}
          {showCropper && imageSrc && (
            <div style={styles.modal}>
              <div style={styles.modalContent}>
                <h3 style={styles.modalTitle}>Crop Image (450x350)</h3>
                <Cropper
                  ref={cropperRef}
                  src={imageSrc}
                  style={{ height: 400, width: '100%' }}
                  aspectRatio={450 / 350}
                  guides={true}
                  viewMode={1}
                  minCropBoxWidth={100}
                  minCropBoxHeight={77.78}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                />
                <div style={styles.modalActions}>
                  <button onClick={handleCrop} style={styles.cropButton}>
                    Crop Image
                  </button>
                  <button onClick={handleCancelCrop} style={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clients List */}
          <div ref={clientsListRef} style={styles.listContainer}>
            <h3 style={styles.listTitle}>Existing Clients</h3>
            {loading ? (
              <AdminLoadingSpinner message="Loading clients..." />
            ) : clients.length === 0 ? (
              <AdminEmptyState message="No clients yet. Add your first client above!" />
            ) : (
              <div style={styles.clientGrid}>
                {clients.map((client) => (
                  <div key={client._id} style={styles.clientCard}>
                    <img
                      src={client.image}
                      alt={client.name}
                      style={styles.clientImage}
                    />
                    <div style={styles.clientContent}>
                      <h4 style={styles.clientName}>{client.name}</h4>
                      <p style={styles.clientDesignation}>{client.designation}</p>
                      <p style={styles.clientDescription}>{client.description}</p>
                      <div style={styles.clientActions}>
                        <button
                          onClick={() => handleEdit(client)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    color: '#2c3e50',
    backgroundColor: 'white',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    color: '#2c3e50',
    backgroundColor: 'white',
  },
  fileInput: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    color: '#2c3e50',
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    display: 'block',
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '5px',
  },
  imagePreview: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
  },
  previewText: {
    margin: 0,
    color: '#155724',
    fontSize: '14px',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#7f8c8d',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'flex-end',
  },
  cropButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  listContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  listTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
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
  clientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  clientCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  clientImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  clientContent: {
    padding: '15px',
  },
  clientName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '5px',
  },
  clientDesignation: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#3498db',
    marginBottom: '10px',
  },
  clientDescription: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  clientActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    flex: 1,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  deleteButton: {
    flex: 1,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};
