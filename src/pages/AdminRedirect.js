import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem('queueless_admin');
    
    if (adminData) {
      window.location.href = '/admin/index.html';
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin fa-2x"></i>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;