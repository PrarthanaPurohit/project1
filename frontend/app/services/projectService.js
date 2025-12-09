import api from './api';

export const projectService = {
  // Public endpoint - get all projects
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data.data;
  },

  // Admin endpoints
  getAdminProjects: async () => {
    const response = await api.get('/admin/projects');
    return response.data.data;
  },

  createProject: async (formData) => {
    const response = await api.post('/admin/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProject: async (id, formData) => {
    const response = await api.put(`/admin/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/admin/projects/${id}`);
  },
};
