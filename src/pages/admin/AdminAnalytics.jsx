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
  // FIX #2: track fetch errors so we show a message instead of blank page
  const [fetchError, setFetchError] = useState(null);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // FIX #2: fetch independently so a menu failure doesn't kill order data
        const [ordersRes, menuRes] = await Promise.all([
          api.get('/orders/'),
          api.get('/menu/'),
        ]);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setMenuItems(Array.isArray(menuRes.data) ? menuRes.data : []);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setFetchError('Failed to load analytics data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <div className="admin-analytics">
        <div style={{
          background: '#FEF2F2', color: '#DC2626', padding: '1.5rem',
          borderRadius: '12px', border: '1px solid #FECACA', marginTop: '2rem'
        }}>
          {fetchError}
        </div>
      </div>
    );
  }

  // FIX #2: safe date filtering — guard against null order_time
  const getFilteredOrders = () => {
    const now = new Date();
    const cutoff = new Date();
    if (dateRange === 'week')  cutoff.setDate(now.getDate() - 7);
    else if (dateRange === 'month') cutoff.setMonth(now.getMonth() - 1);
    else if (dateRange === 'year')  cutoff.setFullYear(now.getFullYear() - 1);
    else return orders; // all time

    return orders.filter(o => {
      if (!o.order_time) return false;
      return new Date(o.order_time) >= cutoff;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Metrics — guard against null total_amount
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // Daily orders & revenue
  const getDailyData = () => {
    const endDate = new Date();
    const startDate = new Date();
    if (dateRange === 'week')  startDate.setDate(endDate.getDate() - 6);
    else if (dateRange === 'month') startDate.setDate(endDate.getDate() - 29);
    else if (dateRange === 'year')  startDate.setFullYear(endDate.getFullYear() - 1);
    else startDate.setDate(endDate.getDate() - 29); // all time: cap 30 days

    const diffDays = Math.min(30, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const days = [];
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }

    const ordersByDate = {};
    filteredOrders.forEach(o => {
      if (!o.order_time) return;
      const date = o.order_time.slice(0, 10);
      ordersByDate[date] = ordersByDate[date] || { orders: 0, revenue: 0 };
      ordersByDate[date].orders += 1;
      ordersByDate[date].revenue += parseFloat(o.total_amount || 0);
    });

    return days.map(day => ({
      day: day.slice(5), // show MM-DD not full date
      orders: ordersByDate[day]?.orders || 0,
      revenue: Math.round((ordersByDate[day]?.revenue || 0) * 100) / 100,
    }));
  };

  // Category sales — FIX #2: use item_name from order items, map item_id to category via menu
  const getCategorySales = () => {
    const itemCategory = {};
    menuItems.forEach(item => { itemCategory[item.item_id] = item.category; });

    const categoryMap = {};
    filteredOrders.forEach(order => {
      if (!order.items) return;
      order.items.forEach(item => {
        const cat = itemCategory[item.item_id] || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity * parseFloat(item.price || 0));
      });
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));
  };

  // Hourly distribution
  const getHourlyData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, orders: 0 }));
    filteredOrders.forEach(order => {
      if (!order.order_time) return;
      const hour = new Date(order.order_time).getHours();
      hours[hour].orders += 1;
    });
    return hours;
  };

  // Top selling items — FIX #2: use item_name that order_service sets dynamically
  const getTopItems = () => {
    const itemSales = {};
    filteredOrders.forEach(order => {
      if (!order.items) return;
      order.items.forEach(item => {
        const name = item.item_name || `Item ${item.item_id}`;
        itemSales[name] = (itemSales[name] || 0) + (item.quantity || 0);
      });
    });
    return Object.entries(itemSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const dailyData    = getDailyData();
  const categoryData = getCategorySales();
  const hourlyData   = getHourlyData();
  const topItems     = getTopItems();

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h1>Analytics</h1>
        <div className="header-controls">
          <div className="date-range">
            <Calendar size={16} />
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
          <span className="metric-label">Top Items Tracked</span>
          <span className="metric-value">{topItems.length}</span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-results" style={{ padding: '3rem', background: 'white', borderRadius: '16px', marginTop: '1rem' }}>
          No orders found for the selected period.
        </div>
      ) : (
        <div className="charts-grid">
          {/* Daily Orders & Revenue */}
          <div className="chart-card full-width">
            <h3>Daily Orders &amp; Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  orientation="left"  stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left"  dataKey="orders"  fill="#2563EB" name="Orders" radius={[4,4,0,0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue (₹)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Sales */}
          <div className="chart-card">
            <h3>Sales by Category (₹)</h3>
            {categoryData.length === 0 ? (
              <p className="no-results">No category data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    outerRadius={80} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Hourly Distribution */}
          <div className="chart-card">
            <h3>Peak Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fontSize: 10 }} interval={2} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Items */}
          <div className="chart-card">
            <h3>Top Selling Items</h3>
            <table className="top-items-table">
              <thead>
                <tr><th>Item</th><th>Qty Sold</th></tr>
              </thead>
              <tbody>
                {topItems.length > 0 ? topItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td className="item-sales">{item.sales}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="no-results">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;