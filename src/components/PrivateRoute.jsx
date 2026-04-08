import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

// FIX #3: Instead of redirecting to "/", show the login modal in place.
// After successful login, the user lands exactly on the page they wanted.
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(true);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          gap: '1rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1.1rem' }}>Please log in to view this page.</p>
          <button
            className="modal-submit"
            style={{ width: 'auto', padding: '0.6rem 2rem' }}
            onClick={() => setModalOpen(true)}
          >
            Login / Sign Up
          </button>
        </div>
        <LoginModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          redirectTo={location.pathname}
        />
      </>
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};