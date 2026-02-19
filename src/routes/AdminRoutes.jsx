import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminProtectedRoute from '../components/common/AdminProtectedRoute';
import AdminLogin from '../pages/admin/Login';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminOrders from '../pages/admin/Orders';
import AdminMenu from '../pages/admin/MenuManagement';
import AdminCustomers from '../pages/admin/Customers';
import AdminTables from '../pages/admin/Tables';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminSettings from '../pages/admin/Settings';
import AdminReports from '../pages/admin/Reports';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route path="/" element={
        <AdminProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="tables" element={<AdminTables />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;