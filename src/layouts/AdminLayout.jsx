import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/analytics">Analytics</NavLink>
        </nav>
        <button onClick={logout} className="logout-btn">Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;