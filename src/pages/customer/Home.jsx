import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';

const Home = ({ user, tableNumber, cartCount, activeOrdersCount, onShowLogin }) => {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    borderRadius: '12px',
    marginBottom: '40px'
  };

  const featuresGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
          Welcome to Queueless
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
          Scan, Order, Enjoy - No Waiting in Lines
        </p>
        
        {!tableNumber ? (
          <Link to="/scan" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '15px 30px',
            background: 'white',
            color: '#667eea',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Icon name="qr" size={24} /> Scan Table QR
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '50px',
              fontSize: '18px'
            }}>
              <Icon name="table" /> Table {tableNumber}
            </span>
            {!user && (
              <button onClick={onShowLogin} style={{
                padding: '10px 20px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon name="user" /> Login to Order
              </button>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>How It Works</h2>
      <div style={featuresGrid}>
        <Card icon="qr" title="1. Scan QR">
          <p style={{ color: '#666', lineHeight: '1.6' }}>Scan the QR code on your table to get started</p>
        </Card>
        <Card icon="menu" title="2. Browse Menu">
          <p style={{ color: '#666', lineHeight: '1.6' }}>Explore our delicious dishes and specials</p>
        </Card>
        <Card icon="cart" title="3. Place Order">
          <p style={{ color: '#666', lineHeight: '1.6' }}>Add items to cart and place your order</p>
        </Card>
        <Card icon="clock" title="4. Track & Enjoy">
          <p style={{ color: '#666', lineHeight: '1.6' }}>Track your order in real-time and enjoy!</p>
        </Card>
      </div>

      {/* Quick Stats */}
      {user && (cartCount > 0 || activeOrdersCount > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {cartCount > 0 && (
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Icon name="cart" size={40} color="#667eea" />
                <h3 style={{ fontSize: '36px', color: '#667eea', margin: '10px 0' }}>{cartCount}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>Items in Cart</p>
                <Link to="/cart" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                  View Cart →
                </Link>
              </div>
            </Card>
          )}
          {activeOrdersCount > 0 && (
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Icon name="orders" size={40} color="#48bb78" />
                <h3 style={{ fontSize: '36px', color: '#48bb78', margin: '10px 0' }}>{activeOrdersCount}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>Active Orders</p>
                <Link to="/orders" style={{ color: '#48bb78', textDecoration: 'none', fontWeight: '500' }}>
                  Track Orders →
                </Link>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;