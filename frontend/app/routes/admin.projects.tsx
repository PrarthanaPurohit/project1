import { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';
import { projectService, type Project } from '../services/projectService';
import type { Route } from './+types/admin.projects';
import Cropper, { type ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import AdminLoadingSpinner from '../components/AdminLoadingSpinner';
import AdminEmptyState from '../components/AdminEmptyState';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Project Management - Admin Panel' },
    { name: 'description', content: 'Manage projects' },
  ];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Edit state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectsListRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getAdminProjects();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch projects';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
      errors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!editingProject && !croppedImage) {
      errors.image = 'Project image is required';
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
      if (formData.location.trim()) {
        formDataToSend.append('location', formData.location.trim());
      }
      
      if (croppedImage) {
        formDataToSend.append('image', croppedImage, imageFile?.name || 'project.jpg');
      }
      
      if (editingProject) {
        await projectService.updateProject(editingProject._id, formDataToSend);
        toast.success('Project updated successfully!');
      } else {
        await projectService.createProject(formDataToSend);
        toast.success('Project created successfully!');
      }
      
      // Reset form
      setFormData({ name: '', description: '', location: '' });
      setImageFile(null);
      setImageSrc(null);
      setCroppedImage(null);
      setEditingProject(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh projects list
      await fetchProjects();
      
      // Scroll to projects list to show the new/updated project
      setTimeout(() => {
        projectsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save project';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      location: project.location || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '', location: '' });
    setImageFile(null);
    setImageSrc(null);
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted successfully!');
      await fetchProjects();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete project';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <ToastContainer toasts={toast.toasts} onClose={toast.hideToast} />
        <div>
          <h2 style={styles.title}>Project Management</h2>
          <p style={styles.description}>
            Add, edit, and manage your portfolio projects
          </p>

          {/* Add/Edit Project Form */}
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Project Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(formErrors.name ? styles.inputError : {}),
                  }}
                  placeholder="Enter project name"
                />
                {formErrors.name && (
                  <span style={styles.errorText}>{formErrors.name}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Project Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    ...styles.textarea,
                    ...(formErrors.description ? styles.inputError : {}),
                  }}
                  placeholder="Enter project description"
                  rows={4}
                />
                {formErrors.description && (
                  <span style={styles.errorText}>{formErrors.description}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter project location (e.g., New York, USA)"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Project Image * {editingProject && '(Leave empty to keep current image)'}
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
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                </button>
                {editingProject && (
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

          {/* Projects List */}
          <div ref={projectsListRef} style={styles.listContainer}>
            <h3 style={styles.listTitle}>Existing Projects</h3>
            {loading ? (
              <AdminLoadingSpinner message="Loading projects..." />
            ) : projects.length === 0 ? (
              <AdminEmptyState message="No projects yet. Add your first project above!" />
            ) : (
              <div style={styles.projectGrid}>
                {projects.map((project) => (
                  <div key={project._id} style={styles.projectCard}>
                    <img
                      src={project.image}
                      alt={project.name}
                      style={styles.projectImage}
                    />
                    <div style={styles.projectContent}>
                      <h4 style={styles.projectName}>{project.name}</h4>
                      {project.location && (
                        <p style={styles.projectLocation}>📍 {project.location}</p>
                      )}
                      <p style={styles.projectDescription}>{project.description}</p>
                      <div style={styles.projectActions}>
                        <button
                          onClick={() => handleEdit(project)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
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
    fontSize: 'clamp(20px, 5vw, 28px)',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  description: {
    fontSize: 'clamp(14px, 3vw, 16px)',
    color: '#7f8c8d',
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 'clamp(16px, 4vw, 30px)',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    marginBottom: 'clamp(20px, 4vw, 30px)',
  },
  formTitle: {
    fontSize: 'clamp(18px, 4vw, 20px)',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '16px',
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
    padding: 'clamp(12px, 3vw, 20px)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 'clamp(16px, 4vw, 30px)',
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
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: 'clamp(12px, 3vw, 20px)',
  },
  projectCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  projectImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
  },
  projectContent: {
    padding: '15px',
  },
  projectName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  projectLocation: {
    fontSize: '13px',
    color: '#95a5a6',
    marginBottom: '8px',
  },
  projectDescription: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  projectActions: {
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
