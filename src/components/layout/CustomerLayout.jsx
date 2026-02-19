import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';

const CustomerLayout = () => {
  return (
    <div className="customer-layout">
      <Header />
      <main className="customer-main">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CustomerLayout;