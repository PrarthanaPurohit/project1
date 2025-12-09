import api from './api';

export const contactService = {
  // Public endpoint - submit contact form
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Admin endpoints
  getAllContacts: async () => {
    const response = await api.get('/admin/contacts');
    return response.data.data;
  },

  deleteContact: async (id) => {
    await api.delete(`/admin/contacts/${id}`);
  },
};
