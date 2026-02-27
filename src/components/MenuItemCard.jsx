import React from 'react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item }) => {
  const { addItem, isTableSelected } = useCart();

  const handleAddToCart = () => {
    if (!isTableSelected) {
      alert('Please select a table first.');
      return;
    }
    addItem(item);
  };

  return (
    <div className="menu-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${item.image})` }}
      ></div>
      <div className="card-content">
        <h3>{item.name}</h3>
        <p className="description">{item.description}</p>
        <div className="card-footer">
          <span className="price">{formatCurrency(item.price)}</span>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;