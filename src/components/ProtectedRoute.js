import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles, requireTable = false }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireTable && !user.tableNumber) {
    return <Navigate to="/scan" replace />;
  }

  return children;
};

export default ProtectedRoute;