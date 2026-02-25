import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../utils/constants';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';

const PaymentForm = () => {
  const { items, total, tableNumber, clearCart, setPaymentMethod } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    setPaymentMethod(selectedMethod);
    const order = {
      table: tableNumber,
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total,
      status: 'pending',
      userEmail: user?.email || null, // store user email if logged in
    };
    createOrder(order);
    clearCart();
    navigate('/tracking');
  };

  if (!tableNumber) {
    return <p>Please select a table before proceeding to payment.</p>;
  }

  return (
    <div className="payment-form">
      <h3>Payment</h3>
      <div className="payment-methods">
        {PAYMENT_METHODS.map(method => (
          <label key={method}>
            <input
              type="radio"
              name="payment"
              value={method}
              checked={selectedMethod === method}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            {method}
          </label>
        ))}
      </div>
      <button className="pay-btn" onClick={handlePayment} disabled={!selectedMethod}>
        Pay {formatCurrency(total)}
      </button>
    </div>
  );
};

export default PaymentForm;