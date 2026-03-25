import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';
import { Clock, CheckCircle, ChefHat, PackageCheck, Truck } from 'lucide-react';

const getStatusIcon = (status) => {
  switch(status) {
    case 'pending': return <Clock size={20} />;
    case 'accepted': return <CheckCircle size={20} />;
    case 'preparing': return <ChefHat size={20} />;
    case 'ready': return <PackageCheck size={20} />;
    case 'completed': return <Truck size={20} />;
    default: return <Clock size={20} />;
  }
};

const OrderTimeline = ({ order }) => {
  const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
  const currentIndex = statusOrder.indexOf(order.order_status);

  return (
    <div className="order-timeline">
      {statusOrder.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="step-icon">{getStatusIcon(status)}</div>
            <div className="step-content">
              <div className="step-status">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        // Filter orders for current user if needed (backend may already filter)
        const userOrders = response.data.filter(order => order.user_id === user?.user_id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const currentOrders = orders.filter(o => o.order_status !== 'completed');
  const pastOrders = orders.filter(o => o.order_status === 'completed');

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  return (
    <div className="tracking-page">
      <h2>Your Orders</h2>
      {currentOrders.length === 0 && <p>No active orders.</p>}
      {currentOrders.map(order => (
        <div key={order.order_id} className="order-card">
          <div className="order-header">
            <span className="order-id">Order #{order.order_id}</span>
            <OrderStatusBadge status={order.order_status} />
          </div>
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>{item.quantity} x {item.menu_item?.item_name || item.item_name || `Item ${item.item_id}`}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">Total: {formatCurrency(order.total_amount)}</div>
          <OrderTimeline order={order} />
        </div>
      ))}
      {pastOrders.length > 0 && (
        <>
          <h3>Order History</h3>
          {pastOrders.map(order => (
            <div key={order.order_id} className="order-card past">
              <div className="order-header">
                <span className="order-id">Order #{order.order_id}</span>
                <OrderStatusBadge status={order.order_status} />
              </div>
              <div className="order-items">
                {order.items.length} items • {formatCurrency(order.total_amount)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderTrackingPage;