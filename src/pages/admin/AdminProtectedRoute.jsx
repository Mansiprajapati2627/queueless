import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children, allowedRoles = ['admin', 'kitchen'] }) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('queueless_user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;