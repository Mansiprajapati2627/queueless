import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';
import KitchenDashboard from '../pages/kitchen/KitchenDashboard';
import KitchenOrders from '../pages/kitchen/KitchenOrders';
import KitchenSettings from '../pages/kitchen/KitchenSettings';

const KitchenRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <AdminProtectedRoute allowedRoles={['kitchen']}>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<KitchenDashboard />} />
        <Route path="orders" element={<KitchenOrders />} />
        <Route path="settings" element={<KitchenSettings />} />
      </Route>
    </Routes>
  );
};

export default KitchenRoutes;