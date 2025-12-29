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
    console.log('📤 Original Data:', config.data); // ✅ Log original data
    
    // Transform request data from camelCase to snake_case
    if (config.data) {
      const transformed = camelToSnake(config.data);
      console.log('🔄 Transformed Data:', transformed); // ✅ Log transformed data
      config.data = transformed;
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
    // ✅ Enhanced error logging
    console.error('🔴 Response Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      
      // ✅ Transform error response if needed
      const transformedError = snakeToCamel(errorData);
      
      // ✅ Get the error message
      const message = transformedError?.message || errorData?.message || 'An error occurred';
      
      // ✅ Create error with additional info
      const customError = new Error(message);
      customError.response = error.response;
      customError.status = error.response.status;
      customError.data = transformedError;
      
      throw customError;
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
 * Authentication API
 */
export const authAPI = {
  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      console.log('🔐 Registering user:', userData);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      console.log('🔐 Logging in user:', { email: credentials.email });
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (otpData) => {
    try {
      console.log('🔐 Verifying OTP for:', otpData.email);
      const response = await api.post('/auth/verify-otp', otpData);
      return response.data;
    } catch (error) {
      console.error('❌ OTP verification failed:', error.message);
      throw error;
    }
  },

  /**
   * Resend OTP
   */
  resendOTP: async (email) => {
    try {
      console.log('🔐 Resending OTP to:', email);
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      console.error('❌ Resend OTP failed:', error.message);
      throw error;
    }
  }
};

/**
 * Orders API
 */
export const ordersAPI = {
  /**
   * Get all orders
   */
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },

  /**
   * Get single order by ID
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * Create new order
   */
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  },

  /**
   * Update order
   */
  update: async (id, updates) => {
    const response = await api.put(`/orders/${id}`, updates);
    return response.data.data;
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
    return response.data.data;
  },

  /**
   * Get statistics
   */
  getStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data.data;
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
