import axios from 'axios';

// Create a direct API instance for auth operations (to avoid circular imports)
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password, twoFactorCode = null) => {
  try {
    const response = await authAPI.post('/auth/login', { 
      email, 
      password,
      twoFactorCode
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  const response = await authAPI.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const getCurrentUser = async () => {
  const response = await authAPI.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await authAPI.put('/users/profile', userData);
  return response.data;
};

// Two-factor authentication methods
export const getTwoFactorStatus = async () => {
  const response = await authAPI.get('/auth/two-factor/status');
  return response.data;
};

export const setupTwoFactor = async () => {
  const response = await authAPI.post('/auth/two-factor/setup');
  return response.data;
};

export const verifyTwoFactor = async (token) => {
  const response = await authAPI.post('/auth/two-factor/verify', { token });
  return response.data;
};

export const disableTwoFactor = async (token) => {
  const response = await authAPI.post('/auth/two-factor/disable', { token });
  return response.data;
};

export const validateTwoFactor = async (email, token) => {
  const response = await authAPI.post('/auth/two-factor/validate', { email, token });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  }
  
  return response.data;
};

const requestPasswordReset = async (email) => {
  try {
    console.log('Requesting password reset for:', email);
    const response = await authAPI.post('/auth/request-password-reset', { email });
    console.log('Password reset requested successfully');
    return response.data;
  } catch (error) {
    console.error('Password reset request failed:', error.response?.data || error.message);
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    console.log('Resetting password with token');
    const response = await authAPI.post('/auth/reset-password', { token, newPassword });
    console.log('Password reset successful');
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error.response?.data || error.message);
    throw error;
  }
};

const verifyEmail = async (token) => {
  try {
    console.log('Verifying email with token');
    const response = await authAPI.get(`/auth/verify-email/${token}`);
    console.log('Email verification successful');
    return response.data;
  } catch (error) {
    console.error('Email verification failed:', error.response?.data || error.message);
    throw error;
  }
};

const resendVerification = async (email) => {
  try {
    console.log('Resending verification email to:', email);
    const response = await authAPI.post('/auth/resend-verification', { email });
    console.log('Verification email sent successfully');
    return response.data;
  } catch (error) {
    console.error('Failed to resend verification:', error.response?.data || error.message);
    throw error;
  }
};

const getCurrentUserDetails = async () => {
  try {
    console.log('Fetching current user details from API');
    const response = await authAPI.get('/auth/me');
    console.log('User details received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user details:', error.response?.data || error.message);
    throw error;
  }
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getCurrentUserDetails,
  register,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
  getTwoFactorStatus,
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
  validateTwoFactor,
  updateUserProfile
};

export default authService;
