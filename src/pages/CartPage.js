import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = ({
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  placeOrder,
  user,
  tableNumber
}) => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const serviceCharge = subtotal * 0.02;
  const total = subtotal + tax + serviceCharge;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsPlacingOrder(true);
    
    const paymentData = {
      method: selectedPayment,
      instructions: instructions
    };

    try {
      const order = placeOrder(paymentData);
      
      if (order) {
        if (selectedPayment === 'upi') {
          navigate('/payment/upi');
        } else {
          // For other payment methods
          alert(`Order placed successfully! Order ID: ${order.id}`);
          navigate('/orders');
        }
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: 'fas fa-mobile-alt', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'card', label: 'Card', icon: 'fas fa-credit-card', description: 'Credit/Debit Card' },
    { id: 'cash', label: 'Cash', icon: 'fas fa-money-bill-wave', description: 'Pay at table' },
    { id: 'wallet', label: 'Wallet', icon: 'fas fa-wallet', description: 'Queueless Wallet' }
  ];

  if (cart.length === 0) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <i className="fas fa-shopping-cart empty-state-icon"></i>
          <h3>Your cart is empty</h3>
          <p>Add delicious items from our menu</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          <h2 className="section-title">Order Items</h2>
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                
                <div className="cart-item-content">
                  <div className="cart-item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-icon btn-danger"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <p className="item-description">{item.description}</p>
                  
                  <div className="cart-item-footer">
                    <div className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="qty-btn"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="qty-btn"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="summary-card">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Service Charge</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="total-amount">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="instructions-section">
            <h3 className="section-subtitle">Special Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special requests or dietary restrictions?"
              className="instructions-input"
            />
          </div>

          {/* Payment Methods */}
          <div className="payment-section">
            <h3 className="section-subtitle">Choose Payment Method</h3>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`payment-method ${selectedPayment === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="payment-icon">
                    <i className={method.icon}></i>
                  </div>
                  <div className="payment-details">
                    <span className="payment-label">{method.label}</span>
                    <small className="payment-description">{method.description}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="btn btn-primary btn-lg place-order-btn"
          >
            {isPlacingOrder ? (
              <>
                <div className="loading-spinner" style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent' }} />
                Placing Order...
              </>
            ) : (
              <>
                <i className="fas fa-lock"></i>
                Place Order - ₹{total.toFixed(2)}
              </>
            )}
          </button>

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="btn btn-secondary"
            style={{ marginTop: '16px', width: '100%' }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </main>
  );
};

export default CartPage;