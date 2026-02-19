import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Icon from '../../components/common/Icon';

const AdminReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('week');

  const generateReport = () => {
    const orders = JSON.parse(localStorage.getItem('queueless_orders') || '[]');
    
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      if (dateRange === 'today') return diffDays === 0;
      if (dateRange === 'week') return diffDays <= 7;
      if (dateRange === 'month') return diffDays <= 30;
      return true;
    });

    const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
    alert(`Report generated: ${filtered.length} orders, ₹${totalRevenue} revenue`);
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>Reports</h1>

      <Card>
        <div className="form-group">
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
          >
            <option value="sales">Sales Report</option>
            <option value="items">Items Report</option>
            <option value="customers">Customer Report</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <Button onClick={generateReport} icon="download" fullWidth>
          Generate Report
        </Button>
      </Card>
    </div>
  );
};

export default AdminReports;