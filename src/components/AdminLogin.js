import React, { useState } from 'react';

const AdminLogin = ({ onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check admin credentials
    if (
      (credentials.username === 'admin' || credentials.username === 'admin@queueless.com') 
      && credentials.password === 'admin123'
    ) {
      // Store admin session
      const adminUser = {
        name: 'Administrator',
        username: credentials.username,
        role: 'admin'
      };
      
      localStorage.setItem('queueless_admin', JSON.stringify(adminUser));
      
      // Redirect to admin dashboard
      window.location.href = '/admin/index.html';
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-user-shield"></i> Admin Login</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: 'var(--border-radius)',
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="input-group">
            <label>
              <i className="fas fa-user-shield"></i>
              Admin Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="admin"
              required
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-key"></i>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: <code>admin</code> | Password: <code>admin123</code></p>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Login to Admin
          </button>

          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;