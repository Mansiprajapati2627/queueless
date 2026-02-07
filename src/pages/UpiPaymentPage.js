import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpiPaymentPage = ({ cart, placeOrder, user, tableNumber }) => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState('googlepay');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderDetails, setOrderDetails] = useState(null);
  const [timer, setTimer] = useState(5);

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

  useEffect(() => {
    let interval;
    if (paymentStatus === 'success' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      navigate('/orders');
    }
    return () => clearInterval(interval);
  }, [paymentStatus, timer, navigate]);

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
        instructions: '',
        amount: orderDetails.total
      };

      const order = placeOrder(paymentData);
      
      if (order) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    }, 3000);
  };

  if (paymentStatus === 'success') {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="success-animation">
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--sage)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'scaleIn 0.5s ease'
          }}>
            <i className="fas fa-check" style={{ fontSize: '48px', color: 'white' }}></i>
          </div>
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed</p>
          <div style={{ 
            background: 'var(--gray-100)', 
            padding: '20px', 
            borderRadius: 'var(--border-radius)', 
            margin: '20px auto',
            maxWidth: '400px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Amount Paid:</span>
              <span style={{ fontWeight: '700', color: 'var(--sage)' }}>₹{orderDetails?.total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Table Number:</span>
              <span>{tableNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Payment Method:</span>
              <span>UPI ({selectedApp})</span>
            </div>
          </div>
          <p style={{ color: 'var(--charcoal-light)' }}>
            Redirecting to order tracking in {timer} seconds...
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            Go to Orders Now
          </button>
        </div>
        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); }
            70% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </main>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <main className="main-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="processing-animation">
          <div className="loading-spinner" style={{ 
            width: '60px', 
            height: '60px', 
            margin: '0 auto 20px',
            border: '3px solid var(--gray-200)',
            borderTopColor: 'var(--primary)'
          }}></div>
          <h3>Processing Payment</h3>
          <p>Please wait while we confirm your payment...</p>
          <div style={{
            background: 'var(--gray-100)',
            padding: '20px',
            borderRadius: 'var(--border-radius)',
            marginTop: '20px',
            maxWidth: '400px',
            margin: '20px auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Amount:</span>
              <span style={{ fontWeight: '700' }}>₹{orderDetails?.total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Table:</span>
              <span>{tableNumber}</span>
            </div>
          </div>
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
              <i className="fas fa-chair" style={{ marginRight: '4px' }}></i>
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
                style={{ 
                  borderColor: selectedApp === app.id ? app.color : '',
                  background: selectedApp === app.id ? `${app.color}10` : 'var(--white)'
                }}
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
            border: '1px solid var(--border)'
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
              borderRadius: 'var(--border-radius)',
              position: 'relative'
            }}>
              {/* QR Code Pattern */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '150px',
                height: '150px',
                background: 'repeating-linear-gradient(45deg, #333, #333 10px, #666 10px, #666 20px)',
                opacity: 0.3
              }}></div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12px',
                color: 'var(--gray-600)',
                fontWeight: '600'
              }}>
                UPI QR CODE
              </div>
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '16px' }}>
              Scan this QR code with any UPI app
            </p>
            <div style={{ 
              background: 'var(--gray-100)', 
              padding: '12px',
              borderRadius: 'var(--border-radius)',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              wordBreak: 'break-all'
            }}>
              restaurant@queueless.upi
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-500)', 
              marginTop: '12px',
              background: 'var(--gray-50)',
              padding: '8px',
              borderRadius: 'var(--border-radius-sm)'
            }}>
              Amount: ₹{orderDetails?.total.toFixed(2)}
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