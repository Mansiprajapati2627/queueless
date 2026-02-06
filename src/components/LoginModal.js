import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose, onLogin, onSignup, onLogout, user }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const navigate = useNavigate();

  // Admin credentials check
  const isAdminCredentials = (email, password) => {
    return (email === 'admin' || email === 'admin@queueless.com') && password === 'admin123';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for admin credentials first
    if (isAdminCredentials(formData.email, formData.password)) {
      // Store admin session
      const adminUser = {
        name: 'Administrator',
        email: formData.email,
        phone: '0000000000',
        role: 'admin'
      };
      
      localStorage.setItem('queueless_admin', JSON.stringify(adminUser));
      localStorage.setItem('queueless_user', JSON.stringify(adminUser));
      
      // Redirect to admin dashboard
      window.location.href = '/admin/index.html';
      onClose();
      return;
    }
    
    // Regular user login/signup
    if (isLogin) {
      // Demo login
      if (formData.email === 'user@example.com' && formData.password === 'password123') {
        onLogin({
          name: 'John Doe',
          email: formData.email,
          phone: '9876543210',
          role: 'user'
        });
      } else {
        // Any other email works for demo
        onLogin({
          name: formData.email.split('@')[0],
          email: formData.email,
          phone: '0000000000',
          role: 'user'
        });
      }
    } else {
      // Signup
      onSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'user'
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoutClick = () => {
    // Clear admin session on logout
    localStorage.removeItem('queueless_admin');
    
    if (onLogout) {
      onLogout();
      onClose();
    }
  };

  // If user is already logged in, show logout option
  if (user) {
    const isAdmin = user.role === 'admin' || localStorage.getItem('queueless_admin');
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2><i className="fas fa-user-circle"></i> Account</h2>
            <button onClick={onClose} className="btn-close">&times;</button>
          </div>

          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '2rem', width: '100%' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: isAdmin ? 'var(--dark)' : 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                {isAdmin ? <i className="fas fa-user-shield"></i> : <i className="fas fa-user"></i>}
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>{user.name}</h3>
              <p style={{ color: 'var(--charcoal-light)', marginBottom: '0.5rem' }}>
                {user.email} 
                {isAdmin && <span style={{
                  background: 'var(--dark)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  marginLeft: '0.5rem'
                }}>ADMIN</span>}
              </p>
              {user.phone && user.phone !== '0000000000' && (
                <p style={{ color: 'var(--charcoal-light)' }}>
                  <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i>
                  {user.phone}
                </p>
              )}
            </div>

            <div className="demo-credentials" style={{
              background: 'var(--gray-100)',
              padding: '1rem',
              borderRadius: 'var(--border-radius)',
              marginBottom: '1.5rem'
            }}>
              {isAdmin ? (
                <p><strong>Admin Dashboard:</strong> Click below to access admin panel</p>
              ) : (
                <p><strong>Demo Account:</strong> user@example.com / password123</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              {isAdmin && (
                <button 
                  onClick={() => {
                    window.location.href = '/admin/index.html';
                    onClose();
                  }}
                  className="btn btn-dark"
                  style={{ width: '100%' }}
                >
                  <i className="fas fa-tachometer-alt"></i> Go to Admin Dashboard
                </button>
              )}
              
              <button 
                onClick={handleLogoutClick} 
                className="btn btn-danger"
                style={{ width: '100%' }}
              >
                <i className="fas fa-sign-out-alt"></i> Log Out
              </button>
              
              <button 
                onClick={onClose}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup form for non-logged in users
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-user-circle"></i> {isLogin ? 'Login' : 'Sign Up'}</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {!isLogin && (
            <div className="input-group">
              <label>
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div className="input-group">
              <label>
                <i className="fas fa-phone"></i>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9876543210"
                required={!isLogin}
              />
            </div>
          )}

          <div className="input-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email / Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email or admin username"
              required
            />
          </div>

          <div className="input-group">
            <label>
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          {isLogin && (
            <div className="demo-credentials">
              <p><strong>User Demo:</strong> user@example.com / password123</p>
              <p><strong>Admin Login:</strong> admin / admin123</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;