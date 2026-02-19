import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const CartPage = ({ cart, updateQuantity, removeFromCart, clearCart, placeOrder, user, tableNumber, cartTotal }) => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');

  const subtotal = cartTotal;
  const tax = subtotal * 0.05;
  const serviceCharge = subtotal * 0.02;
  const total = subtotal + tax + serviceCharge;

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const cartItemsStyle = {
    marginBottom: '20px'
  };

  const cartItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const itemInfoStyle = {
    flex: 2
  };

  const itemActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const quantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const summaryStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#666'
  };

  const totalRowStyle = {
    ...summaryRowStyle,
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  };

  const instructionsStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    margin: '20px 0',
    resize: 'vertical'
  };

  if (cart.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="cart" size={64} />
          <h2 style={{ margin: '20px 0', color: '#666' }}>Your cart is empty</h2>
          <p style={{ color: '#999', marginBottom: '30px' }}>Add some delicious items from our menu</p>
          <Link to="/menu">
            <Button icon="menu">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const order = placeOrder({ method: 'card', instructions });
    if (order) {
      navigate('/orders');
    }
  };

  const handleUPIPayment = () => {
    navigate('/payment/upi', { state: { instructions } });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="back" size={24} />
        </button>
        <h1>Your Cart</h1>
        <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#f56565', cursor: 'pointer' }}>
          <Icon name="delete" /> Clear
        </button>
      </div>

      <div style={cartItemsStyle}>
        {cart.map(item => (
          <div key={item.id} style={cartItemStyle}>
            <div style={itemInfoStyle}>
              <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
              <p style={{ color: '#667eea', fontWeight: 'bold' }}>₹{item.price}</p>
            </div>
            <div style={itemActionsStyle}>
              <div style={quantityControlsStyle}>
                <button
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Icon name="minus" size={12} />
                </button>
                <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Icon name="plus" size={12} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', color: '#f56565', cursor: 'pointer' }}
              >
                <Icon name="delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={summaryStyle}>
        <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
        
        <div style={summaryRowStyle}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={summaryRowStyle}>
          <span>GST (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div style={summaryRowStyle}>
          <span>Service Charge (2%)</span>
          <span>₹{serviceCharge.toFixed(2)}</span>
        </div>
        <div style={totalRowStyle}>
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <textarea
          placeholder="Special instructions (allergies, customizations, etc.)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={instructionsStyle}
          rows="3"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
          <Button onClick={handlePlaceOrder} icon="card" fullWidth>
            Pay with Card
          </Button>
          <Button variant="secondary" onClick={handleUPIPayment} icon="payment" fullWidth>
            Pay with UPI
          </Button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '14px' }}>
          <Icon name="table" /> Table {tableNumber}
        </p>
      </div>
    </div>
  );
};

export default CartPage;