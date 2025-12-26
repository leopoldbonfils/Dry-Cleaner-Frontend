import axios from 'axios';
import { snakeToCamel, camelToSnake } from '../../utils/helpers';

// Base API URL - adjust this to match your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - transform camelCase to snake_case
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Transform request data from camelCase to snake_case
    if (config.data) {
      config.data = camelToSnake(config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - transform snake_case to camelCase
api.interceptors.response.use(
  (response) => {
    console.log(`🟢 API Response: ${response.config.url}`, response.data);
    
    // Transform response data from snake_case to camelCase
    if (response.data) {
      response.data = snakeToCamel(response.data);
    }
    
    return response;
  },
  (error) => {
    console.error('🔴 Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message);
    }
  }
);

/**
 * Orders API
 */
export const ordersAPI = {
  /**
   * Get all orders
   */
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data.data; // Returns transformed camelCase data
  },

  /**
   * Get single order by ID
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data; // Returns transformed camelCase data
  },

  /**
   * Create new order
   */
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data; // Returns transformed camelCase data
  },

  /**
   * Update order
   */
  update: async (id, updates) => {
    const response = await api.put(`/orders/${id}`, updates);
    return response.data.data; // Returns transformed camelCase data
  },

  /**
   * Delete order
   */
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  /**
   * Search orders
   */
  search: async (query) => {
    const response = await api.get('/orders/search', {
      params: { query }
    });
    return response.data.data; // Returns transformed camelCase data
  },

  /**
   * Get statistics
   */
  getStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data.data; // Returns transformed camelCase data
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default api;