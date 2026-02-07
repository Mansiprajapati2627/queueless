import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' // 'admin' or 'kitchen'
  });
  const [error, setError] = useState('');

  // Demo admin/kitchen credentials
  const demoCredentials = {
    admin: { email: 'admin@queueless.com', password: 'admin123' },
    kitchen: { email: 'kitchen@queueless.com', password: 'kitchen123' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const credentials = demoCredentials[formData.role];
    
    if (formData.email === credentials.email && formData.password === credentials.password) {
      const user = {
        id: '1',
        name: formData.role === 'admin' ? 'Admin User' : 'Kitchen Staff',
        email: formData.email,
        role: formData.role,
        phone: formData.role === 'admin' ? '9999999999' : '8888888888'
      };
      
      onLogin(user);
      
      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/kitchen/dashboard');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--border-radius-lg)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Q
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--charcoal)' }}>
            Staff Login
          </h1>
          <p style={{ color: 'var(--charcoal-light)' }}>
            Access your admin or kitchen panel
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-light)',
            color: 'var(--blush-dark)',
            padding: '12px',
            borderRadius: 'var(--border-radius)',
            marginBottom: '20px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Login As
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `2px solid ${formData.role === 'admin' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--border-radius)',
                  background: formData.role === 'admin' ? 'var(--primary)' : 'white',
                  color: formData.role === 'admin' ? 'white' : 'var(--charcoal)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-crown"></i>
                Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'kitchen' })}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: `2px solid ${formData.role === 'kitchen' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--border-radius)',
                  background: formData.role === 'kitchen' ? 'var(--primary)' : 'white',
                  color: formData.role === 'kitchen' ? 'white' : 'var(--charcoal)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-utensils"></i>
                Kitchen
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div style={{
            background: 'var(--gray-100)',
            padding: '12px',
            borderRadius: 'var(--border-radius)',
            marginBottom: '20px',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>Demo Credentials:</p>
            <p style={{ margin: '0', fontSize: '0.75rem' }}>
              <strong>Email:</strong> {demoCredentials[formData.role].email}<br />
              <strong>Password:</strong> {demoCredentials[formData.role].password}
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid var(--border)',
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--primary-dark)'}
            onMouseLeave={(e) => e.target.style.background = 'var(--primary)'}
          >
            Login as {formData.role === 'admin' ? 'Admin' : 'Kitchen Staff'}
          </button>

          {/* Back to main site */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '15px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary)';
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
            Back to Main Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;