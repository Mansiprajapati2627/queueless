import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const LoginModal = ({ onClose, onLogin, onSignup, onLogout, user, demoCustomers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const demoUser = demoCustomers.find(
        c => c.email === formData.email && c.password === formData.password
      );
      
      if (demoUser) {
        onLogin({ name: demoUser.name, email: demoUser.email, phone: demoUser.phone });
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      onSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
    }
  };

  const handleDemoLogin = (customer) => {
    onLogin({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isLogin ? 'Login' : 'Sign Up'}>
      {error && (
        <div style={{ 
          background: '#fed7d7', 
          color: '#c53030', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <Input
              label="Full Name"
              icon="user"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              label="Phone Number"
              icon="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </>
        )}

        <Input
          label="Email"
          type="email"
          icon="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <Input
          label="Password"
          type="password"
          icon="lock"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <Button type="submit" fullWidth>
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '10px' }}>Demo Login:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {demoCustomers.map((customer, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin(customer)}
            >
              {customer.name}
            </Button>
          ))}
        </div>
      </div>

      <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </Modal>
  );
};

export default LoginModal;