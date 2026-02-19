import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import Button from '../common/Button';

const Header = ({ user, tableNumber, cartCount, onShowLogin, onLogout }) => {
  const headerStyle = {
    background: 'white',
    padding: '15px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none'
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    background: '#667eea',
    color: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const logoTextStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  };

  const cartIconStyle = {
    position: 'relative',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#333'
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#f56565',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <div style={logoIconStyle}>Q</div>
          <span style={logoTextStyle}>Queueless</span>
          {tableNumber && (
            <span style={{
              background: '#e2e8f0',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginLeft: '10px'
            }}>
              Table {tableNumber}
            </span>
          )}
        </Link>

        <div style={actionsStyle}>
          <Link to="/cart" style={cartIconStyle}>
            <Icon name="cart" size={24} />
            {cartCount > 0 && (
              <span style={cartBadgeStyle}>{cartCount}</span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>{user.name}</span>
              <Button size="sm" variant="outline" onClick={onLogout} icon="logout">
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={onShowLogin} icon="user">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;