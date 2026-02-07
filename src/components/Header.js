import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, tableNumber, cartCount, onShowLogin }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'kitchen') {
      navigate('/kitchen');
    } else {
      onShowLogin();
    }
  };

  return (
    <header className="header" style={{
      background: 'var(--white)',
      padding: '1rem 2rem',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              Q
            </div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'var(--charcoal)'
            }}>
              Queueless
            </span>
          </Link>
          
          {user?.role === 'admin' && (
            <span style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Admin
            </span>
          )}
          
          {user?.role === 'kitchen' && (
            <span style={{
              background: 'var(--secondary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Kitchen
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {tableNumber && (
            <div style={{
              background: 'var(--gray-100)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius)',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              <i className="fas fa-chair" style={{ marginRight: '0.5rem' }}></i>
              Table {tableNumber}
            </div>
          )}
          
          {user?.role === 'customer' && (
            <Link to="/cart" className="btn btn-icon" style={{ position: 'relative' }}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--accent)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          <button 
            onClick={handleProfileClick}
            className="btn btn-icon"
            style={{
              background: 'var(--gray-100)',
              border: 'none'
            }}
          >
            {user ? (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <i className="fas fa-user"></i>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;