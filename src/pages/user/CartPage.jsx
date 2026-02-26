import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import PaymentForm from '../../components/PaymentForm';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

const CartPage = () => {
  const { items, total, isTableSelected, tableNumber, setTableNumber } = useCart();
  const [isChangingTable, setIsChangingTable] = useState(false);
  const [newTable, setNewTable] = useState('');

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
      <PaymentForm />
    </div>
  );
};

export default CartPage;