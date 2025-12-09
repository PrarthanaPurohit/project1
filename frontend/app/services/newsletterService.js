import api from './api';

export const newsletterService = {
  // Public endpoint - subscribe to newsletter
  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  // Admin endpoints
  getAllSubscriptions: async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data.data;
  },

  deleteSubscription: async (id) => {
    await api.delete(`/admin/subscriptions/${id}`);
  },
};
