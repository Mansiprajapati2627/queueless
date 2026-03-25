import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import { Calendar, Download } from 'lucide-react';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          api.get('/orders'),
          api.get('/menu')
        ]);
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Helper to filter orders by date range
  const getFilteredOrders = () => {
    const now = new Date();
    const cutoff = new Date();
    if (dateRange === 'week') cutoff.setDate(now.getDate() - 7);
    else if (dateRange === 'month') cutoff.setMonth(now.getMonth() - 1);
    else if (dateRange === 'year') cutoff.setFullYear(now.getFullYear() - 1);
    else cutoff.setDate(0); // all time
    return orders.filter(o => new Date(o.order_time) >= cutoff);
  };

  const filteredOrders = getFilteredOrders();

  // Metrics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // Daily orders & revenue for last 7 days (or for the selected range)
  const getDailyData = () => {
    const days = [];
    const endDate = new Date();
    const startDate = new Date();
    if (dateRange === 'week') startDate.setDate(endDate.getDate() - 6);
    else if (dateRange === 'month') startDate.setDate(endDate.getDate() - 29);
    else if (dateRange === 'year') startDate.setFullYear(endDate.getFullYear() - 1);
    else startDate.setDate(0); // all time – we'll cap at 30 days for performance

    // Generate date labels
    const diffDays = Math.min(30, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d.toISOString().slice(0,10));
    }

    const ordersByDate = {};
    filteredOrders.forEach(o => {
      const date = o.order_time.slice(0,10);
      ordersByDate[date] = ordersByDate[date] || { orders: 0, revenue: 0 };
      ordersByDate[date].orders += 1;
      ordersByDate[date].revenue += parseFloat(o.total_amount);
    });

    return days.map(day => ({
      day,
      orders: ordersByDate[day]?.orders || 0,
      revenue: ordersByDate[day]?.revenue || 0
    }));
  };

  // Category sales (sum of all order items)
  const getCategorySales = () => {
    const categoryMap = {};
    // Map item_id to category
    const itemCategory = {};
    menuItems.forEach(item => {
      itemCategory[item.item_id] = item.category;
    });

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const cat = itemCategory[item.item_id];
        if (cat) {
          categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity * parseFloat(item.price));
        }
      });
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  // Hourly distribution (orders per hour of day)
  const getHourlyData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, orders: 0 }));
    filteredOrders.forEach(order => {
      const hour = new Date(order.order_time).getHours();
      hours[hour].orders += 1;
    });
    return hours;
  };

  // Top selling items (by quantity sold)
  const getTopItems = () => {
  const itemSales = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const name = item.item_name;  // <-- use item_name directly
      itemSales[name] = (itemSales[name] || 0) + item.quantity;
    });
  });
  return Object.entries(itemSales)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a,b) => b.sales - a.sales)
    .slice(0, 5);
};

  const dailyData = getDailyData();
  const categoryData = getCategorySales();
  const hourlyData = getHourlyData();
  const topItems = getTopItems();

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <div className="header-controls">
          <div className="date-range">
            <Calendar size={18} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="export-btn" onClick={() => alert('Export feature coming soon')}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <span className="metric-label">Total Orders</span>
          <span className="metric-value">{totalOrders}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Revenue</span>
          <span className="metric-value">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Avg. Order Value</span>
          <span className="metric-value">{formatCurrency(avgOrderValue)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Popular Items</span>
          <span className="metric-value">{topItems.length}</span>
        </div>
      </div>

      {/* Daily Orders & Revenue */}
      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3>Daily Orders & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis yAxisId="left" orientation="left" stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#2563EB" name="Orders" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales */}
        <div className="chart-card">
          <h3>Sales by Category (₹)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Order Distribution */}
        <div className="chart-card">
          <h3>Peak Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Items */}
        <div className="chart-card">
          <h3>Top Selling Items</h3>
          <table className="top-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td className="item-sales">{item.sales}</td>
                </tr>
              ))}
              {topItems.length === 0 && (
                <tr>
                  <td colSpan="2" className="no-results">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;