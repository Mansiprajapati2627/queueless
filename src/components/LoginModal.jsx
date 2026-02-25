import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    resetForm();
    setMode('login');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const success = login(email, password);
        if (success) {
          handleClose();
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Sign up
        const result = register(name, email, password, phone);
        if (result.success) {
          handleClose();
        } else {
          setError(result.error);
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'login' ? 'Login to your account' : 'Sign up to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}
          
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <button type="submit" className="modal-submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={toggleMode} className="modal-link">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleMode} className="modal-link">
                Login
              </button>
            </p>
          )}
        </div>

        {mode === 'login' && (
          <div className="modal-demo">
            <p>Demo: admin@queueless.com / admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;