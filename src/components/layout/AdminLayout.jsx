import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';

const AdminLayout = () => {
  const layoutStyle = {
    display: 'flex',
    minHeight: '100vh'
  };

  const mainStyle = {
    flex: 1,
    background: '#f7fafc',
    display: 'flex',
    flexDirection: 'column'
  };

  const contentStyle = {
    padding: '20px',
    overflowY: 'auto'
  };

  return (
    <div style={layoutStyle}>
      <AdminSidebar />
      <div style={mainStyle}>
        <AdminHeader />
        <div style={contentStyle}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;