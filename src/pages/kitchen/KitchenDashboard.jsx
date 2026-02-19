import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    const kitchenOrders = allOrders.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    );
    setOrders(kitchenOrders);
  }, []);

  const updateStatus = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    const updated = allOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('queueless_orders', JSON.stringify(updated));
    setOrders(updated.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)));
  };

  const containerStyle = {
    padding: '20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const statsStyle = {
    display: 'flex',
    gap: '20px'
  };

  const statStyle = {
    textAlign: 'center'
  };

  const ordersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  };

  const orderCardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    marginTop: '10px'
  };

  const pending = orders.filter(o => o.status === 'pending').length;
  const preparing = orders.filter(o => o.status === 'preparing').length;
  const ready = orders.filter(o => o.status === 'ready').length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Kitchen Dashboard</h1>
        <div style={statsStyle}>
          <div style={statStyle}>
            <Icon name="clock" size={24} color="#ed8936" />
            <div>{pending}</div>
            <div>Pending</div>
          </div>
          <div style={statStyle}>
            <Icon name="food" size={24} color="#4299e1" />
            <div>{preparing}</div>
            <div>Preparing</div>
          </div>
          <div style={statStyle}>
            <Icon name="check" size={24} color="#48bb78" />
            <div>{ready}</div>
            <div>Ready</div>
          </div>
        </div>
      </div>

      <div style={ordersGridStyle}>
        {orders.map(order => (
          <div key={order.id} style={orderCardStyle}>
            <div style={orderHeaderStyle}>
              <h3>Order #{order.id}</h3>
              <span className={`status-badge ${order.status}`}>{order.status}</span>
            </div>
            <p><strong>Table:</strong> {order.tableNumber}</p>
            <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString()}</p>
            <div style={{ margin: '10px 0' }}>
              <strong>Items:</strong>
              {order.items?.map((item, idx) => (
                <div key={idx}>{item.quantity}x {item.name}</div>
              ))}
            </div>
            {order.instructions && (
              <p style={{ background: '#f7fafc', padding: '8px', borderRadius: '4px' }}>
                <strong>Note:</strong> {order.instructions}
              </p>
            )}
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              style={selectStyle}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;