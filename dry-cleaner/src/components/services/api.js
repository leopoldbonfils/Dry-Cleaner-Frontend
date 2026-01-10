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
  timeout: 30000, // ✅ Increased timeout to 30 seconds for email sending
});

// Request interceptor - transform camelCase to snake_case
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('📤 Original Data:', config.data);
    
    // Transform request data from camelCase to snake_case
    if (config.data) {
      const transformed = camelToSnake(config.data);
      console.log('🔄 Transformed Data:', transformed);
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
      method: error.config?.method,
      message: error.message
    });
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      
      // Transform error response if needed
      const transformedError = snakeToCamel(errorData);
      
      // Get the error message
      const message = transformedError?.message || errorData?.message || 'An error occurred';
      
      // ✅ Check if this is actually a success response with wrong status code
      if (transformedError?.success === true || errorData?.success === true) {
        console.log('✅ Response marked as success despite error status');
        return Promise.resolve({
          data: transformedError || errorData,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          config: error.config
        });
      }
      
      // Create error with additional info
      const customError = new Error(message);
      customError.response = error.response;
      customError.status = error.response.status;
      customError.data = transformedError;
      
      throw customError;
    } else if (error.request) {
      // ✅ Request was made but no response received - check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The server is taking too long to respond.');
      }
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
      console.log('📝 Registering user:', userData);
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
  },

  /**
   * Forgot Password
   */
  forgotPassword: async (data) => {
    try {
      console.log('🔐 Requesting password reset for:', data.email);
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('❌ Forgot password failed:', error.message);
      throw error;
    }
  },

  /**
   * Verify Reset OTP
   */
  verifyResetOTP: async (data) => {
    try {
      console.log('🔐 Verifying reset OTP for:', data.email);
      const response = await api.post('/auth/verify-reset-otp', data);
      return response.data;
    } catch (error) {
      console.error('❌ Reset OTP verification failed:', error.message);
      throw error;
    }
  },

  /**
   * Reset Password
   */
  resetPassword: async (data) => {
    try {
      console.log('🔐 Resetting password for:', data.email);
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('❌ Reset password failed:', error.message);
      throw error;
    }
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      console.log('📖 Fetching profile');
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error.message);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    try {
      console.log('📝 Updating profile:', profileData);
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('❌ Profile update failed:', error.message);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (passwordData) => {
    try {
      console.log('🔒 Changing password');
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('❌ Password change failed:', error.message);
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
    try {
      const response = await api.get('/orders');
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error.message);
      throw error;
    }
  },

  /**
   * Get single order by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to fetch order:', error.message);
      throw error;
    }
  },

  /**
   * Create new order
   */
  create: async (orderData) => {
    try {
      console.log('➕ Creating order via API...');
      const response = await api.post('/orders', orderData);
      console.log('✅ Order API response received:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to create order:', error.message);
      throw error;
    }
  },

  /**
   * Update order
   */
  update: async (id, updates) => {
    try {
      const response = await api.put(`/orders/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to update order:', error.message);
      throw error;
    }
  },

  /**
   * Delete order
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete order:', error.message);
      throw error;
    }
  },

  /**
   * Search orders
   */
  search: async (query) => {
    try {
      const response = await api.get('/orders/search', {
        params: { query }
      });
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to search orders:', error.message);
      throw error;
    }
  },

  /**
   * Get statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data.data;
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error.message);
      throw error;
    }
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