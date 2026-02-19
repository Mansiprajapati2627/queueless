import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, requireTable = false, children, redirectTo = '/' }) => {
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireTable && !localStorage.getItem('queueless_table')) {
    return <Navigate to="/scan" replace />;
  }

  return children;
};

export default ProtectedRoute;