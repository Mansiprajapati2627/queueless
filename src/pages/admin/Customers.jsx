import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    const uniqueCustomers = [];
    const seen = new Set();
    
    orders.forEach(order => {
      if (order.customerEmail && !seen.has(order.customerEmail)) {
        seen.add(order.customerEmail);
        uniqueCustomers.push({
          id: order.customerEmail,
          name: order.customerName || 'Guest',
          email: order.customerEmail,
          phone: order.customerPhone || 'N/A',
          totalOrders: orders.filter(o => o.customerEmail === order.customerEmail).length,
          totalSpent: orders
            .filter(o => o.customerEmail === order.customerEmail)
            .reduce((sum, o) => sum + o.total, 0),
          lastVisit: order.createdAt
        });
      }
    });
    
    setCustomers(uniqueCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerStyle = {
    padding: '20px'
  };

  const headerStyle = {
    marginBottom: '30px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
    borderBottom: '2px solid #e2e8f0',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0'
  };

  const customerCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const avatarStyle = {
    width: '35px',
    height: '35px',
    background: '#667eea',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => {
      const lastVisit = new Date(c.lastVisit);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastVisit > thirtyDaysAgo;
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Customers</h1>
      </div>

      <div style={statsGridStyle}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="users" size={32} color="#667eea" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>{stats.total}</h3>
            <p style={{ color: '#666' }}>Total Customers</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="user" size={32} color="#48bb78" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>{stats.active}</h3>
            <p style={{ color: '#666' }}>Active (30 days)</p>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <Icon name="money" size={32} color="#ed8936" />
            <h3 style={{ fontSize: '24px', margin: '10px 0' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p style={{ color: '#666' }}>Total Revenue</p>
          </div>
        </Card>
      </div>

      <Input
        placeholder="Search customers by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon="search"
        style={{ marginBottom: '20px' }}
      />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Orders</th>
            <th style={thStyle}>Total Spent</th>
            <th style={thStyle}>Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td style={tdStyle}>
                <div style={customerCellStyle}>
                  <div style={avatarStyle}>
                    {customer.name.charAt(0)}
                  </div>
                  <span>{customer.name}</span>
                </div>
              </td>
              <td style={tdStyle}>{customer.email}</td>
              <td style={tdStyle}>{customer.phone}</td>
              <td style={tdStyle}>{customer.totalOrders}</td>
              <td style={tdStyle}>₹{customer.totalSpent.toLocaleString()}</td>
              <td style={tdStyle}>{new Date(customer.lastVisit).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCustomers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="users" size={48} />
          <p style={{ color: '#666', marginTop: '10px' }}>No customers found</p>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;