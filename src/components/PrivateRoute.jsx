import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};