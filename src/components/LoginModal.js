import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin, onSignup, onLogout, user }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Demo login
      if (formData.email === 'user@example.com' && formData.password === 'password123') {
        onLogin({
          name: 'John Doe',
          email: formData.email,
          phone: '9876543210'
        });
      } else {
        // Any other email works for demo
        onLogin({
          name: formData.email.split('@')[0],
          email: formData.email,
          phone: '0000000000'
        });
      }
    } else {
      // Signup
      onSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
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
    if (onLogout) {
      onLogout();
      onClose();
    }
  };

  // If user is already logged in, show logout option
  if (user) {
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
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                <i className="fas fa-user"></i>
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--charcoal)' }}>{user.name}</h3>
              <p style={{ color: 'var(--charcoal-light)', marginBottom: '0.5rem' }}>{user.email}</p>
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
              <p><strong>Demo Account:</strong> user@example.com / password123</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)', marginTop: '0.5rem' }}>
                You are currently logged in with demo credentials
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                onClick={handleLogoutClick} 
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                <i className="fas fa-sign-out-alt"></i> Log Out
              </button>
              
              <button 
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original login/signup form for non-logged in users
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
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
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
              <p><strong>Demo:</strong> user@example.com / password123</p>
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