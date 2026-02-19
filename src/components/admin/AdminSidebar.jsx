import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import Button from '../common/Button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('queueless_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const sidebarStyle = {
    width: '250px',
    background: '#2d3748',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #4a5568'
  };

  const navStyle = {
    flex: 1,
    padding: '20px'
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    color: isActive ? 'white' : '#cbd5e0',
    textDecoration: 'none',
    borderRadius: '4px',
    marginBottom: '5px',
    background: isActive ? '#4a5568' : 'transparent',
    transition: 'all 0.3s'
  });

  const footerStyle = {
    padding: '20px',
    borderTop: '1px solid #4a5568'
  };

  const handleLogout = () => {
    localStorage.removeItem('queueless_user');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/orders', icon: 'orders', label: 'Orders' },
    { path: '/admin/menu', icon: 'menu', label: 'Menu' },
    { path: '/admin/customers', icon: 'users', label: 'Customers' },
    { path: '/admin/tables', icon: 'table', label: 'Tables' },
    { path: '/admin/analytics', icon: 'chart', label: 'Analytics' },
    { path: '/admin/reports', icon: 'download', label: 'Reports' },
    { path: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#667eea',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Q
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Queueless</h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>{user?.role}</p>
          </div>
        </div>
      </div>

      <nav style={navStyle}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => navItemStyle(isActive)}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = '#4a5568';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={footerStyle}>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          icon="logout"
          fullWidth
          style={{ background: 'transparent', color: 'white', borderColor: '#4a5568' }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;