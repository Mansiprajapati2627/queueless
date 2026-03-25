import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const PaymentModal = ({ isOpen, onClose, onConfirm, total, paymentMethod }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [cardType, setCardType] = useState('');

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' },
    { id: 'phonepe', name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/PhonePe_Logo.png' },
    { id: 'paytm', name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.png' },
    { id: 'bhim', name: 'BHIM UPI', icon: 'https://upload.wikimedia.org/wikipedia/en/8/8b/BHIM_Logo.png' },
  ];

  const detectCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return '';
  };

  const handleCardChange = (e) => {
    let value = e.target.value;
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    setCardType(detectCardType(digits));
  };

  const handleUpiPay = (app) => {
    setSelectedUpiApp(app);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm('UPI', { app: app.name, transactionId: 'UPI' + Date.now() });
      onClose();
    }, 1500);
  };

  const handleCardPay = () => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm('Card', { last4: cleaned.slice(-4), transactionId: 'CARD' + Date.now() });
      onClose();
    }, 1500);
  };

  const handleCashPay = () => {
    onConfirm('Cash', {});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-header">
          <h2>Complete Payment</h2>
          <p>Pay {formatCurrency(total)} via {paymentMethod}</p>
        </div>

        <div className="modal-body">
          {paymentMethod === 'UPI' && (
            <div className="upi-options">
              <p className="payment-instruction">Choose your UPI app to pay:</p>
              <div className="upi-apps-grid">
                {upiApps.map(app => (
                  <button
                    key={app.id}
                    className="upi-app-btn"
                    onClick={() => handleUpiPay(app)}
                    disabled={loading}
                  >
                    <img src={app.icon} alt={app.name} className="app-icon" />
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>
              {selectedUpiApp && loading && (
                <div className="payment-loading">
                  <div className="spinner"></div>
                  <p>Processing payment via {selectedUpiApp.name}...</p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'Card' && (
            <div className="card-form">
              <p className="payment-instruction">Enter your card number:</p>
              <div className="form-group">
                <label>Card Number</label>
                <div className="card-input-wrapper">
                  <input
                    type="text"
                    name="number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardChange}
                    disabled={loading}
                  />
                  {cardType && <span className="card-type">{cardType}</span>}
                </div>
              </div>
              {loading && (
                <div className="payment-loading">
                  <div className="spinner"></div>
                  <p>Processing card payment...</p>
                </div>
              )}
              <button
                className="pay-now-btn"
                onClick={handleCardPay}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
              </button>
            </div>
          )}

          {paymentMethod === 'Cash' && (
            <div className="cash-payment">
              <Wallet size={48} className="cash-icon" />
              <p>Pay ₹{total.toFixed(2)} in cash at the counter.</p>
              <button className="pay-now-btn" onClick={handleCashPay} disabled={loading}>
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;