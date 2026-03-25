import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useModal } from '../context/ModalContext';
import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item }) => {
  const { user } = useAuth();
  const { addItem, isTableSelected } = useCart();
  const { openLoginModal } = useModal();

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!user) {
      openLoginModal();
      alert('Please log in to add items to your cart.');
      return;
    }

    if (!isTableSelected) {
      alert('Please select a table first.');
      return;
    }

    // Map backend fields to cart fields
    const cartItem = {
      id: item.item_id,
      name: item.item_name,
      price: item.price,
      image: item.image_url,
      description: item.description,
    };
    addItem(cartItem);
  };

  return (
    <div className="menu-card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${item.image_url})` }}
      />
      <div className="card-content">
        <h3>{item.item_name}</h3>
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