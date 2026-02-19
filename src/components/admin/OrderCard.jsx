import React from 'react';
import { FiClock, FiUser, FiPackage } from 'react-icons/fi';
import Badge from '../common/Badge';

const OrderCard = ({ order, onStatusChange, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      completed: 'secondary',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-card-header">
        <h3>Order #{order.id}</h3>
        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
      </div>

      <div className="order-card-body">
        <p><FiUser /> {order.customerName || 'Guest'}</p>
        <p><FiPackage /> {order.items.length} items</p>
        <p><FiClock /> {new Date(order.createdAt).toLocaleTimeString()}</p>
      </div>

      <div className="order-card-footer">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
        </select>
        <span className="order-total">₹{order.total}</span>
      </div>
    </div>
  );
};

export default OrderCard;