import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useModal } from '../context/ModalContext';
import LoginModal from './LoginModal';
import { ShoppingCart } from 'lucide-react';

const TopBar = () => {
  const { user, logout } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal, openLoginModal } = useModal();

  const handleLogout = () => {
    clearCart();
    logout();
    navigate('/');
  };

  const cartItemsCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <header className="top-bar">
        <div className="container">
          {/* Logo image instead of plain text */}
          <Link to="/" className="logo">
            <img
              src="/logo.svg"
              alt="QueueLess"
              style={{
                height: '36px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>

          <div className="top-bar-actions">
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            <div className="user-section">
              {user ? (
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={openLoginModal} className="login-btn">
                  Login
                </button>
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