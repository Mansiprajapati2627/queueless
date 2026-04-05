import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CartItem from '../../components/CartItem';
import PaymentForm from '../../components/PaymentForm';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import api from '../../services/api';

// FIX: Map display payment method names → DB enum values
// DB enum is ('UPI', 'card', 'cash') — exactly these strings.
// PaymentForm sends 'UPI', 'Card', 'Cash' from PAYMENT_METHODS constants.
// 'Card' and 'Cash' (capital first letter) cause MySQL DataError → 500 → fake CORS error.
const PAYMENT_METHOD_MAP = {
  'UPI': 'UPI',
  'Card': 'card',
  'Cash': 'cash',
  // lowercase fallbacks in case constants change
  'card': 'card',
  'cash': 'cash',
  'upi': 'UPI',
};

const CartPage = () => {
  const { items, total, isTableSelected, tableNumber, setTableNumber, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChangingTable, setIsChangingTable] = useState(false);
  const [newTable, setNewTable] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleTableChange = () => {
    const num = parseInt(newTable, 10);
    if (num >= 1 && num <= 25) {
      setTableNumber(num);
      setIsChangingTable(false);
      setNewTable('');
    } else {
      alert('Please enter a valid table number (1-25)');
    }
  };

  const handlePlaceOrder = async (paymentMethod) => {
    if (!user) {
      alert('Please log in to place an order');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        user_id: user.user_id,
        table_id: tableNumber,
        order_type: 'dine_in',
        total_amount: total,
        items: items.map(item => ({
          item_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const orderResponse = await api.post('/orders/', orderData);
      const order = orderResponse.data;

      // FIX: normalize payment method to match DB enum exactly
      const normalizedMethod = PAYMENT_METHOD_MAP[paymentMethod] || paymentMethod.toLowerCase();

      await api.post('/payments/', {
        order_id: order.order_id,
        payment_mode: normalizedMethod,
        amount: total
      });

      clearCart();
      navigate('/tracking');
    } catch (error) {
      console.error('Order failed:', error);
      if (error.response) {
        alert(`Order failed: ${error.response.data?.detail || error.response.data?.message || 'Unknown error'}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setPlacing(false);
    }
  };

  if (!isTableSelected) {
    return (
      <div className="cart-page">
        <p>No table selected. Please scan the QR code on your table.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <p>Your cart is empty.</p>
        <Link to="/menu">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="table-info">
        <span>Table {tableNumber}</span>
        <button className="change-table-btn" onClick={() => setIsChangingTable(true)}>
          <Edit size={16} /> Change
        </button>
      </div>

      {isChangingTable && (
        <div className="table-change-form">
          <input
            type="number"
            min="1"
            max="25"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            placeholder="Enter new table number"
          />
          <button onClick={handleTableChange}>Update</button>
          <button onClick={() => setIsChangingTable(false)}>Cancel</button>
        </div>
      )}

      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <strong>Total: {formatCurrency(total)}</strong>
      </div>
      <PaymentForm onPlaceOrder={handlePlaceOrder} total={total} placing={placing} />
    </div>
  );
};

export default CartPage;