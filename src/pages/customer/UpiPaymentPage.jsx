import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const UpiPaymentPage = ({ cart, placeOrder, user, tableNumber, cartTotal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const instructions = location.state?.instructions || '';
  
  const [selectedApp, setSelectedApp] = useState('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const subtotal = cartTotal;
  const tax = subtotal * 0.05;
  const serviceCharge = subtotal * 0.02;
  const total = subtotal + tax + serviceCharge;

  const upiId = 'restaurant@queueless.upi';
  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '📱' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'paytm', name: 'Paytm', icon: '📱' },
    { id: 'bhim', name: 'BHIM UPI', icon: '📱' },
  ];

  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px'
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  };

  const summaryStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const paymentStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const upiAppsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    margin: '20px 0'
  };

  const upiAppButtonStyle = (isSelected) => ({
    padding: '15px',
    background: isSelected ? '#ebf4ff' : '#f7fafc',
    border: isSelected ? '2px solid #667eea' : '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  });

  const upiIdBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px',
    margin: '15px 0'
  };

  const copyButtonStyle = {
    padding: '5px 10px',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const instructionsStyle = {
    background: '#f7fafc',
    padding: '15px',
    borderRadius: '8px',
    margin: '20px 0'
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentComplete = () => {
    setProcessing(true);
    setTimeout(() => {
      const order = placeOrder({ method: 'upi', instructions });
      if (order) {
        navigate('/orders');
      }
      setProcessing(false);
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name="back" size={24} />
        </button>
        <h1>UPI Payment</h1>
      </div>

      <div style={contentStyle}>
        <div style={summaryStyle}>
          <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
          <div style={{ marginBottom: '15px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span>Service Charge (2%)</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 'bold', borderTop: '2px solid #e2e8f0', marginTop: '5px' }}>
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={paymentStyle}>
          <h3 style={{ marginBottom: '15px' }}>Select UPI App</h3>
          <div style={upiAppsStyle}>
            {upiApps.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                style={upiAppButtonStyle(selectedApp === app.id)}
              >
                <span style={{ fontSize: '24px' }}>{app.icon}</span>
                <span>{app.name}</span>
              </button>
            ))}
          </div>

          <div>
            <h4 style={{ marginBottom: '10px' }}>Or pay using UPI ID</h4>
            <div style={upiIdBoxStyle}>
              <span style={{ fontFamily: 'monospace', fontSize: '16px' }}>{upiId}</span>
              <button onClick={handleCopyUpiId} style={copyButtonStyle}>
                <Icon name={copied ? 'check' : 'copy'} size={14} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={instructionsStyle}>
            <h4>Instructions:</h4>
            <ol style={{ marginLeft: '20px', color: '#666' }}>
              <li>Open your UPI app</li>
              <li>Scan the QR code or enter UPI ID</li>
              <li>Enter amount: ₹{total.toFixed(2)}</li>
              <li>Complete the payment</li>
              <li>Click "I've Paid" below</li>
            </ol>
          </div>

          <Button
            onClick={handlePaymentComplete}
            disabled={processing}
            icon="payment"
            fullWidth
            size="lg"
          >
            {processing ? 'Processing...' : "I've Completed the Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentPage;