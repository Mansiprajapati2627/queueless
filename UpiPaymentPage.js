import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpiPaymentPage = ({ cart, placeOrder, user, tableNumber }) => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState('googlepay');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Calculate order total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const serviceCharge = subtotal * 0.02;
    const total = subtotal + tax + serviceCharge;

    setOrderDetails({
      subtotal,
      tax,
      serviceCharge,
      total
    });
  }, [cart]);

  const upiApps = [
    { id: 'googlepay', name: 'Google Pay', color: '#4285F4', icon: 'fab fa-google-pay' },
    { id: 'phonepe', name: 'PhonePe', color: '#5F259F', icon: 'fas fa-bolt' },
    { id: 'paytm', name: 'Paytm', color: '#00BAF2', icon: 'fas fa-wallet' },
    { id: 'bhim', name: 'BHIM UPI', color: '#3B8C54', icon: 'fas fa-university' }
  ];

  const handlePayment = () => {
    if (!orderDetails) return;

    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: 'upi',
        instructions: ''
      };

      const order = placeOrder(paymentData);
      
      if (order) {
        setPaymentStatus('success');
        
        // Show success for 3 seconds then redirect
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        setPaymentStatus('failed');
      }
    }, 3000);
  };

  if (paymentStatus === 'success') {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="success-animation">
          <i className="fas fa-check-circle" style={{ fontSize: '80px', color: 'var(--success)', marginBottom: '20px' }}></i>
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed</p>
          <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: 'var(--border-radius)', margin: '20px 0' }}>
            <p><strong>Amount:</strong> ₹{orderDetails?.total.toFixed(2)}</p>
            <p><strong>Table:</strong> {tableNumber}</p>
          </div>
          <p>Redirecting to order tracking...</p>
        </div>
      </main>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="processing-animation">
          <div className="loading-spinner" style={{ width: '60px', height: '60px', margin: '0 auto 20px' }}></div>
          <h3>Processing Payment</h3>
          <p>Please wait while we confirm your payment...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="payment-container">
        {/* Payment Amount */}
        <div className="payment-amount-section">
          <h2 className="section-title">UPI Payment</h2>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
              Total Amount
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--dark)' }}>
              ₹{orderDetails?.total.toFixed(2) || '0.00'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '8px' }}>
              Table {tableNumber}
            </div>
          </div>
        </div>

        {/* UPI Apps */}
        <div className="payment-section">
          <h3 className="section-subtitle">Choose UPI App</h3>
          <div className="payment-methods">
            {upiApps.map((app) => (
              <button
                key={app.id}
                className={`payment-method ${selectedApp === app.id ? 'selected' : ''}`}
                onClick={() => setSelectedApp(app.id)}
                style={{ borderColor: selectedApp === app.id ? app.color : '' }}
              >
                <div className="payment-icon" style={{ color: app.color }}>
                  <i className={app.icon}></i>
                </div>
                <div className="payment-details">
                  <span className="payment-label">{app.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <h3 className="section-subtitle">Scan & Pay</h3>
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
            marginBottom: '20px',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              background: 'white',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--gray-300)',
              borderRadius: 'var(--border-radius)'
            }}>
              <i className="fas fa-qrcode" style={{ fontSize: '60px', color: 'var(--gray-400)' }}></i>
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '16px' }}>
              Scan this QR code with any UPI app
            </p>
            <div style={{ 
              background: 'var(--gray-100)', 
              padding: '12px',
              borderRadius: 'var(--border-radius)',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              restaurant@queueless.upi
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '20px' }}
        >
          <i className="fas fa-lock"></i>
          Pay ₹{orderDetails?.total.toFixed(2) || '0.00'}
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/cart')}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '12px' }}
        >
          Cancel Payment
        </button>
      </div>
    </main>
  );
};

export default UpiPaymentPage;