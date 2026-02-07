import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin, onSignup, onLogout, user, demoCustomers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Check demo customers
      const customer = demoCustomers.find(c => 
        c.email === formData.email && c.password === formData.password
      );
      
      if (customer) {
        onLogin({ ...customer, password: undefined });
        setFormData({ name: '', email: '', password: '', phone: '' });
      } else {
        alert('Invalid credentials. Try: student@college.com / password123');
      }
    } else {
      // Handle signup
      onSignup({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'customer'
      });
      setFormData({ name: '', email: '', password: '', phone: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = () => {
    onLogin({ 
      ...demoCustomers[0], 
      password: undefined 
    });
  };

  if (user) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Profile</h2>
            <button onClick={onClose} className="btn-close">&times;</button>
          </div>
          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3>{user.name}</h3>
              <p style={{ color: 'var(--charcoal-light)' }}>{user.email}</p>
              <p style={{ color: 'var(--charcoal-light)' }}>{user.phone}</p>
              <div style={{
                display: 'inline-block',
                background: 'var(--primary-light)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginTop: '0.5rem'
              }}>
                CUSTOMER
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onLogout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isLogin ? 'Customer Login' : 'Customer Sign Up'}</h2>
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>
        
        {/* Demo Credentials */}
        <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
          <div style={{
            background: 'var(--gray-100)',
            padding: '0.75rem',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0, fontWeight: '500' }}>
              Demo Customer Account:
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>
              Email: student@college.com<br />
              Password: password123
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-sm"
            style={{
              background: 'var(--primary)',
              color: 'white',
              width: '100%',
              marginBottom: '1rem'
            }}
          >
            <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
            Quick Demo Login
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {!isLogin && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-group"
                  required={!isLogin}
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-group"
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-group"
                required
                placeholder="Enter your password"
                minLength="6"
              />
            </div>
            
            {!isLogin && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-group"
                  required={!isLogin}
                  placeholder="Enter your phone number"
                />
              </div>
            )}
            
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginTop: '1rem'
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
          
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;