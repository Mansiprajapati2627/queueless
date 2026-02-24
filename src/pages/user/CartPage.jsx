import React from 'react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import PaymentForm from '../../components/PaymentForm';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { items, total, isTableSelected } = useCart();

  if (!isTableSelected) {
    return (
      <div className="cart-page">
        <p>Please select a table from the Scan page before adding items.</p>
        <Link to="/">Go to Scan</Link>
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