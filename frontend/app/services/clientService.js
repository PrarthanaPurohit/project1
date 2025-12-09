import api from './api';

export const clientService = {
  // Public endpoint - get all clients
  getAllClients: async () => {
    const response = await api.get('/clients');
    return response.data.data;
  },

  // Admin endpoints
  getAdminClients: async () => {
    const response = await api.get('/admin/clients');
    return response.data.data;
  },

  createClient: async (formData) => {
    const response = await api.post('/admin/clients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateClient: async (id, formData) => {
    const response = await api.put(`/admin/clients/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteClient: async (id) => {
    await api.delete(`/admin/clients/${id}`);
  },
};
