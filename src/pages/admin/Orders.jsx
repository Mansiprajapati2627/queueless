import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';

const AdminOrders = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (filter !== 'all') {
      filtered = orders.filter(order => order.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tableNumber.toString().includes(searchTerm)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    localStorage.setItem('queueless_orders', JSON.stringify(updatedOrders));
    window.location.reload();
  };

  const filteredOrders = getFilteredOrders();

  const containerStyle = {
    padding: '20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    overflowX: 'auto',
    padding: '5px 0'
  };

  const tabStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? '#667eea' : 'white',
    color: isActive ? 'white' : '#4a5568',
    border: isActive ? 'none' : '1px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  });

  const searchStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
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
    borderBottom: '2px solid #e2e8f0',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0'
  };

  const selectStyle = {
    padding: '6px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '12px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Order Management</h1>
      </div>

      <div style={tabsStyle}>
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={tabStyle(filter === status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span style={{ background: filter === status ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: '10px' }}>
              {getStatusCount(status)}
            </span>
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search by order ID or table number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Table</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Items</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td style={tdStyle}>#{order.id}</td>
              <td style={tdStyle}>Table {order.tableNumber}</td>
              <td style={tdStyle}>{order.customerName || 'Guest'}</td>
              <td style={tdStyle}>{order.items?.length || 0}</td>
              <td style={tdStyle}>₹{order.total}</td>
              <td style={tdStyle}>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td style={tdStyle}>{new Date(order.createdAt).toLocaleTimeString()}</td>
              <td style={tdStyle}>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  style={selectStyle}
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

      {filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="orders" size={48} />
          <p style={{ color: '#666', marginTop: '10px' }}>No orders found</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;