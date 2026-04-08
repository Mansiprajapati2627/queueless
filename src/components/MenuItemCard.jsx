import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useModal } from '../context/ModalContext';
import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item }) => {
  const { user } = useAuth();
  const { addItem, isTableSelected } = useCart();
  const { openLoginModal } = useModal();

  // FIX #3: item.availability comes from the backend — false means out of stock
  const isAvailable = item.availability !== false;

  const handleAddToCart = () => {
    if (!isAvailable) return; // safety guard — button is already disabled

    if (!user) {
      openLoginModal();
      alert('Please log in to add items to your cart.');
      return;
    }

    if (!isTableSelected) {
      alert('Please select a table first.');
      return;
    }

    addItem({
      id: item.item_id,
      name: item.item_name,
      price: item.price,
      image: item.image_url,
      description: item.description,
    });
  };

  return (
    // FIX #3: add 'out-of-stock' class so CSS can grey the card out
    <div className={`menu-card${!isAvailable ? ' out-of-stock' : ''}`}>
      <div
        className="card-image"
        style={{ backgroundImage: `url(${item.image_url})`, position: 'relative' }}
      >
        {/* FIX #3: overlay badge on the image when unavailable */}
        {!isAvailable && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: '#DC2626', color: 'white',
              padding: '0.3rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3>{item.item_name}</h3>
        <p className="description">{item.description}</p>
        <div className="card-footer">
          <span className="price">{formatCurrency(item.price)}</span>

          {/* FIX #3: show disabled state when out of stock */}
          {isAvailable ? (
            <button onClick={handleAddToCart}>Add to cart</button>
          ) : (
            <button
              disabled
              style={{
                background: '#CBD5E1', color: '#94A3B8',
                cursor: 'not-allowed', opacity: 0.7,
              }}
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;