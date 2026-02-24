import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <TopBar />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default UserLayout;