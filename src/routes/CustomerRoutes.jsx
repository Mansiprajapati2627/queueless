import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/customer/Home';
import MenuPage from '../pages/customer/MenuPage';
import CartPage from '../pages/customer/CartPage';
import OrderTrackingPage from '../pages/customer/OrderTrackingPage';
import UpiPaymentPage from '../pages/customer/UpiPaymentPage';
import TableScanner from '../pages/customer/TableScanner';
import ProfilePage from '../pages/customer/ProfilePage';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="scan" element={<TableScanner />} />
        <Route path="menu" element={
          <ProtectedRoute requireTable={true}>
            <MenuPage />
          </ProtectedRoute>
        } />
        <Route path="cart" element={
          <ProtectedRoute requireTable={true}>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute requireTable={true}>
            <OrderTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="payment/upi" element={
          <ProtectedRoute requireTable={true}>
            <UpiPaymentPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;