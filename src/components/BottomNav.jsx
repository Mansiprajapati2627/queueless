import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Menu, Package, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/menu', icon: Menu, label: 'Menu' },
    { to: '/tracking', icon: Package, label: 'Orders' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={24} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;