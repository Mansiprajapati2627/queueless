import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useModal } from '../context/ModalContext';
import LoginModal from './LoginModal';
import { ShoppingCart } from 'lucide-react';

const TopBar = () => {
  const { user, logout } = useAuth();
  // FIX #4: get clearCart so we can wipe cart state on logout
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal, openLoginModal } = useModal();

  const handleLogout = () => {
    clearCart();   // wipe in-memory cart immediately
    logout();      // removes token + cartItems from localStorage
    navigate('/');
  };

  const cartItemsCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <header className="top-bar">
        <div className="container">
          <Link to="/" className="logo">QueueLess</Link>
          <div className="top-bar-actions">
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </Link>
            <div className="user-section">
              {user ? (
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              ) : (
                <button onClick={openLoginModal} className="login-btn">Login</button>
              )}
            </div>
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default TopBar;