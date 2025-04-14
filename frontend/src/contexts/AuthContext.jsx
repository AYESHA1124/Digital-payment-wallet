import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/auth';
import { useToast } from '@chakra-ui/react';

// Create the Auth Context
const AuthContext = createContext(null);

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [pendingPassword, setPendingPassword] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Check for existing token and load user on mount
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Clear token if invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.twoFactorRequired) {
        setTwoFactorRequired(true);
        setPendingEmail(email);
        setPendingPassword(password);
        setLoading(false);
        return { twoFactorRequired: true };
      }
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateTwoFactor = async (code) => {
    setError(null);
    setLoading(true);
    try {
      if (!pendingEmail) {
        throw new Error('No pending login. Please try again.');
      }
      
      const response = await authService.validateTwoFactor(pendingEmail, code);
      
      if (response.token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setTwoFactorRequired(false);
        setPendingEmail(null);
        setPendingPassword(null);
        return userData;
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.register(userData);
      toast({
        title: 'Registration successful',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const setupTwoFactor = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.setupTwoFactor();
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to setup two-factor authentication.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactor = async (token) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.verifyTwoFactor(token);
      // Refresh user data to update 2FA status
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to verify two-factor code.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async (token) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.disableTwoFactor(token);
      // Refresh user data to update 2FA status
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to disable two-factor authentication.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await authService.updateUserProfile(userData);
      // Update user state with the new data
      setUser(prevUser => ({
        ...prevUser,
        ...response
      }));
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update profile.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getTwoFactorStatus = async () => {
    try {
      return await authService.getTwoFactorStatus();
    } catch (err) {
      console.error('Failed to get 2FA status:', err);
      return { isEnabled: false };
    }
  };

  // Add isAuthenticated property
  const isAuthenticated = !!user;

  // Context value object
  const value = {
    user,
    loading,
    error,
    twoFactorRequired,
    isAuthenticated,
    login,
    register,
    logout,
    validateTwoFactor,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    updateProfile,
    getTwoFactorStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthProvider as the default export
export default AuthProvider; 