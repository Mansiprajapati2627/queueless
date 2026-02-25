import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import LoginModal from './LoginModal';
import { ShoppingCart, User } from 'lucide-react';

const TopBar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="top-bar">
        <div className="container">
          <Link to="/" className="logo">
            QueueLess
          </Link>
          <div className="top-bar-actions">
            {/* Cart Icon */}
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            {/* User / Login */}
            <div className="user-section">
              {user ? (
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="login-btn">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default TopBar;