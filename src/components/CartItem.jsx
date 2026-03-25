import React from 'react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      {item.image && (
        <div className="cart-item-image">
          <img src={item.image} alt={item.name} />
        </div>
      )}
      <div className="item-info">
        <h4>{item.name}</h4>
        <p>{formatCurrency(item.price)} each</p>
      </div>
      <div className="item-actions">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        <button className="remove" onClick={() => removeItem(item.id)}>Remove</button>
      </div>
      <div className="item-total">{formatCurrency(item.price * item.quantity)}</div>
    </div>
  );
};

export default CartItem;