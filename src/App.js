import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import ScanPage from './pages/user/ScanPage';
import HomePage from './pages/user/HomePage';
import MenuPage from './pages/user/MenuPage';
import CartPage from './pages/user/CartPage';
import OrderTrackingPage from './pages/user/OrderTrackingPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* User routes with bottom navigation */}
     <Route path="/" element={<div>User Layout Placeholder</div>}>
        <Route index element={<ScanPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="tracking" element={<OrderTrackingPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin routes protected */}
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Fallback redirect to scan page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;