import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import CustomerRoutes from './CustomerRoutes';
import KitchenRoutes from './KitchenRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/kitchen/*" element={<KitchenRoutes />} />
      <Route path="/*" element={<CustomerRoutes />} />
    </Routes>
  );
};

export default AppRoutes;