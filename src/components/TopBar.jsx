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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .wordmark {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1.35rem;
          letter-spacing: -0.5px;
          color: #fff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0px;
          line-height: 1;
        }

        .wordmark-queue {
          color: #fff;
        }

        .wordmark-less {
          color: rgba(255, 255, 255, 0.55);
          font-weight: 700;
        }

        .wordmark-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #60a5fa;
          border-radius: 50%;
          margin: 0 1px 2px 1px;
          flex-shrink: 0;
        }
      `}</style>

      <header className="top-bar">
        <div className="container">
          <Link to="/" className="wordmark">
            <span className="wordmark-queue">Queue</span>
            <span className="wordmark-dot" />
            <span className="wordmark-less">Less</span>
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