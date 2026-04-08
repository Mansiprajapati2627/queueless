import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, redirectTo = null }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
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
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setError(''); setSuccessMessage('');
  };

  const handleClose = () => { resetForm(); setMode('login'); onClose(); };
  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) handleClose(); };

  // Indian mobile: exactly 10 digits, starts with 6, 7, 8, or 9
  const isValidPhone = (val) => /^[6-9]\d{9}$/.test(val);

  // Only allow digits, cap at 10
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMessage(''); setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.success) {
          handleClose();
          navigate(result.user?.role === 'admin' ? '/admin/dashboard' : (redirectTo || '/profile'));
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Validate phone before hitting the API
        if (!isValidPhone(phone)) {
          setError('Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
          setIsLoading(false);
          return;
        }
        const result = await register(name, email, password, phone);
        if (result.success) {
          setSuccessMessage('Registration successful! You can now log in.');
          setMode('login');
          setPassword('');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(''); setSuccessMessage('');
  };

  if (!isOpen) return null;

  const phoneOk   = phone.length === 10 && isValidPhone(phone);
  const phoneWarn = phone.length === 10 && !isValidPhone(phone);
  const phoneLeft = phone.length > 0 && phone.length < 10;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={handleClose}><X size={20} /></button>

        <div className="modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'login' ? 'Login to your account' : 'Sign up to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error       && <div className="modal-error">{error}</div>}
          {successMessage && <div className="modal-success">{successMessage}</div>}

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text" id="name" value={name}
                onChange={(e) => setName(e.target.value)}
                required placeholder="Rahul Sharma" disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required placeholder="your@email.com" disabled={isLoading}
            />
          </div>

          {/* Phone — mandatory, Indian 10-digit only */}
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', fontSize: '0.88rem',
                  fontWeight: 600, pointerEvents: 'none',
                }}>+91</span>
                <input
                  type="tel" id="phone" value={phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="98765 43210"
                  disabled={isLoading}
                  maxLength={10}
                  inputMode="numeric"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
              {phoneLeft && (
                <small style={{ color: '#F97316', fontSize: '0.74rem', marginTop: '0.25rem', display: 'block' }}>
                  {10 - phone.length} more digit{10 - phone.length !== 1 ? 's' : ''} needed
                </small>
              )}
              {phoneWarn && (
                <small style={{ color: '#DC2626', fontSize: '0.74rem', marginTop: '0.25rem', display: 'block' }}>
                  Number must start with 6, 7, 8, or 9
                </small>
              )}
              {phoneOk && (
                <small style={{ color: '#10B981', fontSize: '0.74rem', marginTop: '0.25rem', display: 'block' }}>
                  ✓ Valid Indian mobile number
                </small>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              required placeholder="••••••••"
              disabled={isLoading} minLength={6}
            />
          </div>

          <button type="submit" className="modal-submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p className="center-text">
              Don't have an account?{' '}
              <button onClick={toggleMode} className="modal-link">Sign up</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleMode} className="modal-link">Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;