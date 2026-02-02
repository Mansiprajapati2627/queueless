import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ activeOrdersCount }) => {
  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home' },
    { path: '/menu', icon: 'fas fa-utensils', label: 'Menu' },
    { path: '/orders', icon: 'fas fa-history', label: 'Orders', badge: activeOrdersCount },
    { path: '/scan', icon: 'fas fa-qrcode', label: 'Scan' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
          {item.badge > 0 && (
            <span className="badge">{item.badge}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;