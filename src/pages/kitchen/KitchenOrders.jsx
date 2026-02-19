import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    setOrders(allOrders);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('queueless_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  const containerStyle = {
    padding: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    background: '#f7fafc',
    borderBottom: '2px solid #e2e8f0'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>All Orders</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Table</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={tdStyle}>#{order.id}</td>
              <td style={tdStyle}>{order.tableNumber}</td>
              <td style={tdStyle}>{order.items?.length || 0}</td>
              <td style={tdStyle}>₹{order.total}</td>
              <td style={tdStyle}>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </td>
              <td style={tdStyle}>{new Date(order.createdAt).toLocaleTimeString()}</td>
              <td style={tdStyle}>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  style={{ padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
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

export default KitchenOrders;