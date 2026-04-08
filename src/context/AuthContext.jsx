import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('token', res.data.access_token);
      const userRes = await api.get('/users/me');
      const loggedInUser = userRes.data;
      setUser(loggedInUser);
      // FIX #1: Return the actual user object so LoginModal can redirect correctly
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail };
    }
  };

  // FIX #2: Add register function that was missing from AuthContext
  const register = async (name, email, password, phone) => {
    try {
      await api.post('/users/register', {
        name,
        email,
        password,
        phone: phone || '0000000000',
        role: 'user',
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  };

  // FIX #4: logout clears cart from localStorage too
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};