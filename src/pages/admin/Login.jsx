import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '400px',
    width: '100%'
  };

  const logoStyle = {
    width: '60px',
    height: '60px',
    background: '#667eea',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const roleSelectorStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  };

  const roleButtonStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    background: isActive ? '#667eea' : 'white',
    color: isActive ? 'white' : '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  });

  const demoStyle = {
    background: '#f7fafc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.email === 'admin@queueless.com' && formData.password === 'admin123') {
      const user = {
        id: '1',
        name: 'Admin User',
        email: formData.email,
        role: 'admin'
      };
      localStorage.setItem('queueless_user', JSON.stringify(user));
      navigate('/admin');
    } else if (formData.email === 'kitchen@queueless.com' && formData.password === 'kitchen123') {
      const user = {
        id: '2',
        name: 'Kitchen Staff',
        email: formData.email,
        role: 'kitchen'
      };
      localStorage.setItem('queueless_user', JSON.stringify(user));
      navigate('/kitchen');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={logoStyle}>Q</div>
          <h1>Staff Login</h1>
        </div>

        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Icon name="error" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={roleSelectorStyle}>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'admin'})}
              style={roleButtonStyle(formData.role === 'admin')}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'kitchen'})}
              style={roleButtonStyle(formData.role === 'kitchen')}
            >
              Kitchen
            </button>
          </div>

          <div style={demoStyle}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Demo Credentials:</p>
            <p>Admin: admin@queueless.com / admin123</p>
            <p>Kitchen: kitchen@queueless.com / kitchen123</p>
          </div>

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

          <Button type="submit" fullWidth size="lg">
            Login as {formData.role === 'admin' ? 'Admin' : 'Kitchen Staff'}
          </Button>
        </form>

        <Button 
          variant="outline" 
          fullWidth 
          style={{ marginTop: '10px' }}
          onClick={() => navigate('/')}
          icon="back"
        >
          Back to Main Site
        </Button>
      </Card>
    </div>
  );
};

export default AdminLogin;