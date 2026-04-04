import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import PaymentModal from './PaymentModal';

const PaymentForm = ({ onPlaceOrder, total, placing }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleProceed = (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    setModalOpen(true);
  };

  const handlePaymentConfirm = (method) => {
    onPlaceOrder(method);
    setModalOpen(false);
  };

  const getIcon = (method) => {
    switch(method) {
      case 'UPI': return <Smartphone size={20} />;
      case 'Card': return <CreditCard size={20} />;
      case 'Cash': return <Wallet size={20} />;
      default: return null;
    }
  };

  return (
    <>
      <form onSubmit={handleProceed} className="payment-form">
        <h3>Payment Method</h3>
        <div className="payment-methods">
          {PAYMENT_METHODS.map(method => (
            <label key={method} className={`payment-method ${selectedMethod === method ? 'selected' : ''}`}>
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
        <div className="payment-summary">
          <div className="total-row">
            <span>Total:</span>
            <span className="total-amount">{formatCurrency(total)}</span>
          </div>
          <button type="submit" className="pay-btn" disabled={placing}>
            {placing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
          </button>
        </div>
      </form>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        total={total}
        paymentMethod={selectedMethod}
      />
    </>
  );
};

export default PaymentForm;