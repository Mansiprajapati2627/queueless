import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../common/Icon';

const BottomNav = ({ activeOrdersCount, cartCount, user }) => {
  const location = useLocation();

  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 100
  };

  const itemStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: isActive ? '#667eea' : '#999',
    fontSize: '12px',
    position: 'relative'
  });

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#f56565',
    color: 'white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/menu', icon: 'menu', label: 'Menu' },
    { path: '/cart', icon: 'cart', label: 'Cart', count: cartCount },
    { path: '/orders', icon: 'orders', label: 'Orders', count: activeOrdersCount },
  ];

  if (user) {
    navItems.push({ path: '/profile', icon: 'user', label: 'Profile' });
  }

  return (
    <nav style={navStyle}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            style={itemStyle(isActive)}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
            {item.count > 0 && (
              <span style={badgeStyle}>{item.count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;