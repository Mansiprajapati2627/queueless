import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    popularItems: []
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Popular items
    const itemCount = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({ totalRevenue, totalOrders, avgOrderValue, popularItems });
  };

  const containerStyle = {
    padding: '20px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
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
      <h1 style={{ marginBottom: '30px' }}>Analytics</h1>

      <div style={statsGridStyle}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="money" size={32} color="#667eea" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p style={{ color: '#666' }}>Total Revenue</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="orders" size={32} color="#48bb78" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>{stats.totalOrders}</h3>
            <p style={{ color: '#666' }}>Total Orders</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="chart" size={32} color="#ed8936" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>₹{stats.avgOrderValue.toFixed(2)}</h3>
            <p style={{ color: '#666' }}>Avg Order Value</p>
          </div>
        </Card>
      </div>

      <Card title="Popular Items" icon="star">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {stats.popularItems.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminAnalytics;