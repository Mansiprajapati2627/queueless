import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useModal } from '../context/ModalContext';
import { formatCurrency } from '../utils/helpers';
import { ShoppingCart, Check } from 'lucide-react';

const MenuItemCard = ({ item }) => {
  const { user } = useAuth();
  const { addItem, isTableSelected } = useCart();
  const { openLoginModal } = useModal();
  const [added, setAdded] = useState(false);   // drives button ✓ state
  const [burst, setBurst]  = useState(false);   // drives pop burst ring

  const isAvailable = item.availability !== false;

  const handleAddToCart = () => {
    if (!isAvailable) return;

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

    // Button tick flash
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);

    // Burst ring
    setBurst(true);
    setTimeout(() => setBurst(false), 600);

    // Global toast
    showToast(item.item_name, item.image_url);
  };

  return (
    <div className={`menu-card${!isAvailable ? ' out-of-stock' : ''}`}>
      <div
        className="card-image"
        style={{ backgroundImage: `url(${item.image_url})`, position: 'relative' }}
      >
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

          {isAvailable ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Burst ring — CSS-only, no extra DOM after burst ends */}
              {burst && <span className="atc-burst" />}

              <button
                className={`atc-btn${added ? ' atc-btn--added' : ''}`}
                onClick={handleAddToCart}
              >
                {added
                  ? <><Check size={14} strokeWidth={3} /> Added!</>
                  : <><ShoppingCart size={14} /> Add to cart</>
                }
              </button>
            </div>
          ) : (
            <button disabled style={{
              background: '#CBD5E1', color: '#94A3B8',
              cursor: 'not-allowed', opacity: 0.7,
              padding: '0.45rem 1rem', borderRadius: '999px',
              fontSize: '0.82rem', fontWeight: 600, border: 'none',
            }}>
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Singleton toast engine ──────────────────────────────────────────────── */
let toastContainer = null;
let toastQueue = [];

function getContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'atc-toast-root';
    Object.assign(toastContainer.style, {
      position: 'fixed',
      bottom: '80px',       // sits above bottom nav
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      gap: '10px',
      pointerEvents: 'none',
    });
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(name, imageUrl) {
  const container = getContainer();

  const toast = document.createElement('div');
  toast.className = 'atc-toast atc-toast--enter';
  toast.innerHTML = `
    ${imageUrl
      ? `<img src="${imageUrl}" alt="" class="atc-toast__img" onerror="this.style.display='none'" />`
      : `<div class="atc-toast__icon">🛒</div>`
    }
    <div class="atc-toast__text">
      <span class="atc-toast__label">Added to cart</span>
      <span class="atc-toast__name">${name}</span>
    </div>
    <div class="atc-toast__check">✓</div>
  `;

  container.appendChild(toast);

  // Trigger enter animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('atc-toast--visible'));
  });

  // Remove after 2.2 s
  setTimeout(() => {
    toast.classList.remove('atc-toast--visible');
    toast.classList.add('atc-toast--exit');
    setTimeout(() => toast.remove(), 350);
  }, 2200);
}

export default MenuItemCard;