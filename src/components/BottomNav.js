import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = ({ activeOrdersCount, user }) => {
  const location = useLocation();
  
  // Customer nav items
  const customerNavItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home' },
    { path: '/menu', icon: 'fas fa-utensils', label: 'Menu' },
    { path: '/scan', icon: 'fas fa-qrcode', label: 'Scan' },
    { path: '/orders', icon: 'fas fa-clock', label: 'Orders', badge: activeOrdersCount }
  ];
  
  // Admin nav items
  const adminNavItems = [
    { path: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/orders', icon: 'fas fa-list', label: 'Orders' },
    { path: '/admin/menu', icon: 'fas fa-utensils', label: 'Menu' },
    { path: '/admin/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' }
  ];
  
  // Kitchen nav items
  const kitchenNavItems = [
    { path: '/kitchen', icon: 'fas fa-utensils', label: 'Orders' },
    { path: '/kitchen/preparing', icon: 'fas fa-fire', label: 'Cooking' },
    { path: '/kitchen/ready', icon: 'fas fa-check-circle', label: 'Ready' },
    { path: '/kitchen/completed', icon: 'fas fa-history', label: 'History' }
  ];
  
  // Select nav items based on user role
  let navItems = customerNavItems;
  if (user?.role === 'admin') {
    navItems = adminNavItems;
  } else if (user?.role === 'kitchen') {
    navItems = kitchenNavItems;
  }
  
  // Hide bottom nav for admin/kitchen on desktop
  if ((user?.role === 'admin' || user?.role === 'kitchen') && window.innerWidth > 768) {
    return null;
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--white)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0.75rem 0',
      zIndex: 100,
      boxShadow: 'var(--shadow-lg)'
    }}>
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: location.pathname === item.path ? 'var(--primary)' : 'var(--charcoal-light)',
            fontSize: '0.75rem',
            position: 'relative'
          }}
        >
          <i className={item.icon} style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}></i>
          <span>{item.label}</span>
          {item.badge > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '5px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;