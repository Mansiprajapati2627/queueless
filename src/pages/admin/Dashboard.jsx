import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalTables: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    const tables = JSON.parse(localStorage.getItem('queueless_tables') || '[]');
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => 
      ['pending', 'confirmed', 'preparing'].includes(o.status)
    ).length;

    const uniqueCustomers = new Set(orders.map(o => o.customerEmail).filter(Boolean));

    setStats({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalCustomers: uniqueCustomers.size,
      totalTables: tables.length
    });

    setRecentOrders(orders.slice(0, 5));
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: 'money', color: '#667eea' },
    { title: 'Total Orders', value: stats.totalOrders, icon: 'orders', color: '#48bb78' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: 'clock', color: '#ed8936' },
    { title: 'Customers', value: stats.totalCustomers, icon: 'users', color: '#9f7aea' },
    { title: 'Tables', value: stats.totalTables, icon: 'table', color: '#4299e1' }
  ];

  const containerStyle = {
    padding: '20px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statIconStyle = (color) => ({
    width: '50px',
    height: '50px',
    background: color,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
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
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>

      <div style={statsGridStyle}>
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={statIconStyle(stat.color)}>
                <Icon name={stat.icon} size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '24px', margin: 0 }}>{stat.value}</h3>
                <p style={{ margin: 0, color: '#666' }}>{stat.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Recent Orders" icon="orders">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Table</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>#{order.id}</td>
                <td style={tdStyle}>Table {order.tableNumber}</td>
                <td style={tdStyle}>₹{order.total}</td>
                <td style={tdStyle}>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(order.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <Link to="/admin/orders" style={{ color: '#667eea' }}>View All Orders →</Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;