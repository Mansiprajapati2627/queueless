import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../utils/constants';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

// Mock QR code component – in real app, generate QR code dynamically
const QRCodeDisplay = ({ amount }) => {
  return (
    <div className="qr-code">
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=queueless@okhdfcbank&pn=QueueLess&am=${amount}&cu=INR`}
        alt="UPI QR Code"
      />
      <p>Scan with any UPI app</p>
      <p className="upi-id">queueless@okhdfcbank</p>
    </div>
  );
};

const PaymentForm = () => {
  const { items, total, tableNumber, clearCart, setPaymentMethod } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    setProcessing(true);
    setPaymentMethod(selectedMethod);

    // Simulate payment processing
    setTimeout(() => {
      const order = {
        table: tableNumber,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total,
        status: 'pending',
        userEmail: user?.email || null,
        paymentMethod: selectedMethod,
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed' }
        ]
      };
      createOrder(order);
      clearCart();
      setProcessing(false);
      navigate('/tracking');
    }, 2000);
  };

  if (!tableNumber) {
    return <p className="payment-error">Please select a table before proceeding to payment.</p>;
  }

  const getIcon = (method) => {
    switch(method) {
      case 'UPI': return <Smartphone size={20} />;
      case 'Card': return <CreditCard size={20} />;
      case 'Cash': return <Wallet size={20} />;
      default: return null;
    }
  };

  return (
    <div className="payment-form">
      <h3>Payment Method</h3>
      
      <div className="payment-methods">
        {PAYMENT_METHODS.map(method => (
          <label 
            key={method} 
            className={`payment-method ${selectedMethod === method ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="payment"
              value={method}
              checked={selectedMethod === method}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span className="method-icon">{getIcon(method)}</span>
            <span className="method-name">{method}</span>
          </label>
        ))}
      </div>

      {selectedMethod === 'UPI' && (
        <div className="upi-section">
          <QRCodeDisplay amount={total} />
        </div>
      )}

      {selectedMethod === 'Card' && (
        <div className="card-section">
          <p>Card payment integration would go here.</p>
          <p className="demo-note">(Demo – in production, integrate Stripe/Razorpay)</p>
        </div>
      )}

      {selectedMethod === 'Cash' && (
        <div className="cash-section">
          <p>Please pay ₹{total} at the counter.</p>
        </div>
      )}

      <div className="payment-summary">
        <div className="total-row">
          <span>Total:</span>
          <span className="total-amount">{formatCurrency(total)}</span>
        </div>
        <button 
          className="pay-btn" 
          onClick={handlePayment} 
          disabled={!selectedMethod || processing}
        >
          {processing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;