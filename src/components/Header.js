import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, tableNumber, cartCount, onShowLogin }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <i className="fas fa-qrcode"></i>
        <h1>Queueless</h1>
        {tableNumber && (
          <div className="table-info">
            <i className="fas fa-chair"></i>
            <span>Table {tableNumber}</span>
          </div>
        )}
      </div>
      
      <div className="header-actions">
        {user ? (
          <button 
            onClick={onShowLogin}
            className="btn btn-secondary"
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-user-circle"></i>
            <span>{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button 
            onClick={onShowLogin}
            className="btn btn-primary"
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </button>
        )}
        
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;