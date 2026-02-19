import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ProfilePage = ({ user, onLogout }) => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    background: '#667eea',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0 auto 20px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    textAlign: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#667eea',
    margin: '5px 0'
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#666'
  };

  const sectionStyle = {
    marginBottom: '30px'
  };

  const sectionTitleStyle = {
    marginBottom: '15px',
    fontSize: '18px'
  };

  const infoListStyle = {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    borderBottom: '1px solid #e2e8f0'
  };

  const ordersListStyle = {
    display: 'grid',
    gap: '10px'
  };

  const orderItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  // Get user's orders
  const getOrders = () => {
    const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    return orders.filter(order => order.customerEmail === user?.email);
  };

  const userOrders = getOrders();
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = userOrders.filter(o => o.status === 'pending').length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={avatarStyle}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1>{user?.name}</h1>
        <p style={{ color: '#666' }}>{user?.email}</p>
        <p style={{ color: '#666' }}>{user?.phone}</p>
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <Icon name="orders" size={24} color="#667eea" />
          <div style={statValueStyle}>{userOrders.length}</div>
          <div style={statLabelStyle}>Total Orders</div>
        </div>
        <div style={statCardStyle}>
          <Icon name="clock" size={24} color="#48bb78" />
          <div style={statValueStyle}>{pendingOrders}</div>
          <div style={statLabelStyle}>Pending</div>
        </div>
        <div style={statCardStyle}>
          <Icon name="money" size={24} color="#ed8936" />
          <div style={statValueStyle}>₹{totalSpent}</div>
          <div style={statLabelStyle}>Total Spent</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Personal Information</h3>
        <div style={infoListStyle}>
          <div style={infoItemStyle}>
            <Icon name="user" size={20} color="#667eea" />
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>Full Name</div>
              <div>{user?.name}</div>
            </div>
          </div>
          <div style={infoItemStyle}>
            <Icon name="email" size={20} color="#667eea" />
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>Email</div>
              <div>{user?.email}</div>
            </div>
          </div>
          <div style={infoItemStyle}>
            <Icon name="phone" size={20} color="#667eea" />
            <div>
              <div style={{ fontSize: '12px', color: '#999' }}>Phone</div>
              <div>{user?.phone}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Recent Orders</h3>
        <div style={ordersListStyle}>
          {userOrders.slice(0, 3).map(order => (
            <Link
              key={order.id}
              to={`/orders`}
              state={{ orderId: order.id }}
              style={orderItemStyle}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>#{order.id}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                  padding: '4px 8px',
                  background: order.status === 'completed' ? '#c6f6d5' : '#feebc8',
                  color: order.status === 'completed' ? '#22543d' : '#744210',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {order.status}
                </span>
                <span style={{ fontWeight: 'bold' }}>₹{order.total}</span>
              </div>
            </Link>
          ))}
        </div>
        {userOrders.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link to="/orders" style={{ color: '#667eea' }}>View All Orders →</Link>
          </div>
        )}
      </div>

      <Button onClick={onLogout} variant="danger" icon="logout" fullWidth size="lg">
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage;