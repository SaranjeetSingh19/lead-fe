import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadService = {
  // Get all leads with filters
  getAllLeads: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.source) params.append('source', filters.source);
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/leads?${params.toString()}`);
    return response.data;
  },

  // Get lead statistics
  getLeadStats: async () => {
    const response = await api.get('/leads/stats');
    return response.data;
  },

  // Get single lead by ID
  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Update lead status
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  // Get website leads
  getWebsiteLeads: async () => {
    const response = await api.get('/website-leads');
    return response.data;
  },

  // Get Meta (Facebook) leads
  getMetaLeads: async () => {
    const response = await api.get('/meta-leads');
    return response.data;
  },

  // Get Instagram leads
  getInstagramLeads: async () => {
    const response = await api.get('/instagram-leads');
    return response.data;
  },

  // Get Google Ads leads
  getGoogleLeads: async () => {
    const response = await api.get('/google-leads');
    return response.data;
  },

  // Submit website form
  createWebsiteLead: async (data) => {
    const response = await api.post('/website-leads', data);
    return response.data;
  },
};

export default api;