import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, Award, CreditCard, MapPin } from 'lucide-react';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';
import { dummyMenu } from '../../utils/dummyData';

const ProfilePage = () => {
  const { user, login, logout, updateProfile } = useAuth();
  const { getUserOrders } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Mock data for additional sections
  const favoriteItems = dummyMenu.slice(0, 4); // first 4 items as favorites
  const loyaltyPoints = 250;
  const savedCards = [
    { id: 1, last4: '4242', brand: 'Visa' },
    { id: 2, last4: '1234', brand: 'Mastercard' }
  ];
  const addresses = [
    { id: 1, label: 'Home', address: '123 Main St, New York, NY 10001' }
  ];

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Profile</h2>
        <p>You are not logged in.</p>
        <Link to="/login" className="login-link">Go to Login</Link>
      </div>
    );
  }

  const userOrders = getUserOrders(user.email);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateProfile(editForm);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-page expanded">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar">
          <User size={48} />
        </div>
        <div className="profile-title">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
        <button className="edit-profile-btn" onClick={handleEditToggle}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Profile Form (conditional) */}
      {isEditing && (
        <div className="edit-profile-form">
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="tel"
            name="phone"
            value={editForm.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="profile-stats">
        <div className="stat-card">
          <Package size={24} />
          <span className="stat-value">{userOrders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <Award size={24} />
          <span className="stat-value">{loyaltyPoints}</span>
          <span className="stat-label">Loyalty Points</span>
        </div>
        <div className="stat-card">
          <Heart size={24} />
          <span className="stat-value">{favoriteItems.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="profile-section">
        <h3>Recent Orders</h3>
        {userOrders.length === 0 ? (
          <p className="empty-message">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {userOrders.slice(0, 3).map(order => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="order-details">
                  <span>{order.items.length} items</span>
                  <span className="order-total">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
            {userOrders.length > 3 && (
              <Link to="/tracking" className="view-all-link">View All Orders</Link>
            )}
          </div>
        )}
      </section>

      {/* Favorite Items */}
      <section className="profile-section">
        <h3>Favorite Items</h3>
        <div className="favorites-grid">
          {favoriteItems.map(item => (
            <div key={item.id} className="favorite-card">
              <div className="favorite-image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="favorite-info">
                <h4>{item.name}</h4>
                <span className="price">{formatCurrency(item.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Payment Methods */}
      <section className="profile-section">
        <h3>Payment Methods</h3>
        <div className="cards-list">
          {savedCards.map(card => (
            <div key={card.id} className="card-item">
              <CreditCard size={20} />
              <span>{card.brand} •••• {card.last4}</span>
            </div>
          ))}
          <button className="add-card-btn">+ Add New Card</button>
        </div>
      </section>

      {/* Saved Addresses */}
      <section className="profile-section">
        <h3>Saved Addresses</h3>
        {addresses.map(addr => (
          <div key={addr.id} className="address-item">
            <MapPin size={20} />
            <div>
              <strong>{addr.label}</strong>
              <p>{addr.address}</p>
            </div>
          </div>
        ))}
        <button className="add-address-btn">+ Add New Address</button>
      </section>

      {/* Account Settings */}
      <section className="profile-section">
        <h3>Account Settings</h3>
        <div className="settings-links">
          <Link to="/change-password" className="settings-link">Change Password</Link>
          <Link to="/notifications" className="settings-link">Notification Preferences</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;