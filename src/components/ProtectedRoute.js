import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, requireTable = false, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireTable && user.role === 'customer' && !user.tableNumber) {
    return <Navigate to="/scan" replace />;
  }

  return children;
};

export default ProtectedRoute;