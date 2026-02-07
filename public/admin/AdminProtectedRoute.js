import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;