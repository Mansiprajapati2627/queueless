import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, tableNumber, cartCount }) => {
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
        {user && (
          <div className="user-info">
            <i className="fas fa-user"></i>
            <span>{user.name}</span>
          </div>
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