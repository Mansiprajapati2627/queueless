import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin, onSignup }) => {
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