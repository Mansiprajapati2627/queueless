import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/orderService';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetchOrders().then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus).then(() => {
      loadOrders();
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-orders">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr><th>Order ID</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.table}</td>
              <td>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
              <td>${order.total}</td>
              <td><OrderStatusBadge status={order.status} /></td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;