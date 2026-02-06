import React from 'react';

const AdminAccess = () => {
  const handleAdminLogin = () => {
    const username = prompt('Admin Username:', 'admin');
    const password = prompt('Admin Password:', '');
    
    if ((username === 'admin' || username === 'admin@queueless.com') && password === 'admin123') {
      const adminUser = {
        name: 'Administrator',
        email: username,
        role: 'admin'
      };
      
      localStorage.setItem('queueless_admin', JSON.stringify(adminUser));
      window.location.href = '/admin/index.html';
    } else if (password !== '') {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      opacity: '0.3',
      transition: 'opacity 0.3s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
    >
      <button
        onClick={handleAdminLogin}
        style={{
          background: '#2d3748',
          border: 'none',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        title="Admin Access"
      >
        <i className="fas fa-user-shield"></i>
      </button>
    </div>
  );
};

export default AdminAccess;