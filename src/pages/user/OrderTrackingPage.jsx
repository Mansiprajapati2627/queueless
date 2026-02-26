import React from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
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
  const currentIndex = statusOrder.indexOf(order.status);
  
  return (
    <div className="order-timeline">
      {statusOrder.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="step-icon">
              {getStatusIcon(status)}
            </div>
            <div className="step-content">
              <div className="step-status">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
              {order.statusHistory?.find(h => h.status === status) && (
                <div className="step-time">
                  {new Date(order.statusHistory.find(h => h.status === status).timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderTrackingPage = () => {
  const { orders } = useOrders();
  const { tableNumber } = useCart();

  const currentOrders = orders.filter(o => o.table === tableNumber && o.status !== 'completed');
  const pastOrders = orders.filter(o => o.table === tableNumber && o.status === 'completed');

  return (
    <div className="tracking-page">
      <h2>Your Orders</h2>
      
      {currentOrders.length === 0 && (
        <p className="no-orders">No active orders. <a href="/menu">Order now!</a></p>
      )}
      
      {currentOrders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <span className="order-id">Order #{order.id}</span>
              <span className="order-table">Table {order.table}</span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>{item.quantity} x {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total">
            Total: {formatCurrency(order.total)}
          </div>

          {/* Timeline */}
          <OrderTimeline order={order} />
        </div>
      ))}

      {pastOrders.length > 0 && (
        <>
          <h3>Order History</h3>
          {pastOrders.map(order => (
            <div key={order.id} className="order-card past">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-items">
                <span>{order.items.length} items • {formatCurrency(order.total)}</span>
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderTrackingPage;