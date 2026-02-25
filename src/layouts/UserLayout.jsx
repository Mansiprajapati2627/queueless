import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const UserLayout = () => {
  return (
    <div className="user-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <main className="main-content" style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 70px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default UserLayout;