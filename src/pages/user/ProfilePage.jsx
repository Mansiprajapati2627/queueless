import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';
import { Package, CreditCard, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="loading-spinner">Loading...</div>;

  const userOrders = orders.filter(order => order.user_id === user.user_id);
  const currentOrders = userOrders.filter(order => order.order_status !== 'completed');
  const pastOrders = userOrders.filter(order => order.order_status === 'completed');
  const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

  // Format phone number (Indian style)
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-phone">{formatPhone(user.phone)}</p>
          <span className={`profile-role ${user.role}`}>
            {user.role === 'admin' ? 'Administrator' : 'Customer'}
          </span>
        </div>
        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <Package size={24} />
          <div>
            <p className="stat-value">{userOrders.length}</p>
            <p className="stat-label">Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <CreditCard size={24} />
          <div>
            <p className="stat-value">{formatCurrency(totalSpent)}</p>
            <p className="stat-label">Total Spent</p>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      {currentOrders.length > 0 && (
        <section className="profile-section">
          <h3>Active Orders</h3>
          <div className="orders-list">
            {currentOrders.map(order => (
              <div key={order.order_id} className="order-item">
                <div className="order-header">
                  <span className="order-id">Order #{order.order_id}</span>
                  <OrderStatusBadge status={order.order_status} />
                </div>
                <div className="order-items-preview">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <span key={idx}>{item.quantity}× {item.menu_item?.item_name}</span>
                  ))}
                  {order.items?.length > 2 && <span>+{order.items.length - 2} more</span>}
                </div>
                <div className="order-total">{formatCurrency(order.total_amount)}</div>
                <Link to={`/tracking?order=${order.order_id}`} className="order-link">
                  Track Order →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <section className="profile-section">
          <h3>Order History</h3>
          <div className="orders-list compact">
            {pastOrders.map(order => (
              <div key={order.order_id} className="order-item compact">
                <div className="order-header">
                  <span className="order-id">Order #{order.order_id}</span>
                  <span className="order-date">
                    {new Date(order.order_time).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-items-preview">
                  {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                </div>
                <div className="order-total">{formatCurrency(order.total_amount)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No orders message */}
      {userOrders.length === 0 && (
        <section className="profile-section">
          <p className="empty-message">You haven't placed any orders yet.</p>
          <Link to="/menu" className="order-link">Start ordering →</Link>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;