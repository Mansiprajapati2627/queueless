import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import { Calendar, Download } from 'lucide-react';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#1E40AF'];

/**
 * Safely parse order_time — append 'Z' if no timezone info present
 * so the browser treats it as UTC. Without this, naive datetimes from
 * Python/PostgreSQL cause "Invalid Date" and break all date comparisons.
 */
const parseDate = (raw) => {
  if (!raw) return null;
  if (/[Zz]$/.test(raw) || /[+-]\d{2}:\d{2}$/.test(raw)) return new Date(raw);
  return new Date(raw + 'Z');
};

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
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

  // FIX: use parseDate() everywhere — never call new Date(o.order_time) directly
  const getFilteredOrders = () => {
    const now = new Date();
    if (dateRange === 'all') return orders;

    const cutoff = new Date();
    if (dateRange === 'week')       cutoff.setDate(now.getDate() - 7);
    else if (dateRange === 'month') cutoff.setDate(now.getDate() - 30);
    else if (dateRange === 'year')  cutoff.setFullYear(now.getFullYear() - 1);

    return orders.filter(o => {
      const d = parseDate(o.order_time);
      return d && !isNaN(d.getTime()) && d >= cutoff;
    });
  };

  const filteredOrders = getFilteredOrders();

  const totalOrders   = filteredOrders.length;
  const totalRevenue  = filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // Daily orders & revenue
  const getDailyData = () => {
    const endDate   = new Date();
    const startDate = new Date();
    if (dateRange === 'week')       startDate.setDate(endDate.getDate() - 6);
    else if (dateRange === 'month') startDate.setDate(endDate.getDate() - 29);
    else if (dateRange === 'year')  startDate.setFullYear(endDate.getFullYear() - 1);
    else                            startDate.setDate(endDate.getDate() - 29);

    const diffDays = Math.min(30, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const days = [];
    for (let i = 0; i <= diffDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD key
    }

    const byDate = {};
    filteredOrders.forEach(o => {
      const d = parseDate(o.order_time);
      if (!d || isNaN(d.getTime())) return;
      const key = d.toISOString().slice(0, 10);
      byDate[key] = byDate[key] || { orders: 0, revenue: 0 };
      byDate[key].orders  += 1;
      byDate[key].revenue += parseFloat(o.total_amount || 0);
    });

    return days.map(day => ({
      day: day.slice(5), // show MM-DD
      orders:  byDate[day]?.orders  || 0,
      revenue: Math.round((byDate[day]?.revenue || 0) * 100) / 100,
    }));
  };

  // Category sales
  const getCategorySales = () => {
    const itemCategory = {};
    menuItems.forEach(item => { itemCategory[item.item_id] = item.category; });

    const catMap = {};
    filteredOrders.forEach(order => {
      if (!order.items) return;
      order.items.forEach(item => {
        const cat = itemCategory[item.item_id] || 'Other';
        catMap[cat] = (catMap[cat] || 0) + (item.quantity * parseFloat(item.price || 0));
      });
    });

    return Object.entries(catMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }));
  };

  // Hourly distribution
  const getHourlyData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, orders: 0 }));
    filteredOrders.forEach(order => {
      const d = parseDate(order.order_time);
      if (!d || isNaN(d.getTime())) return;
      hours[d.getHours()].orders += 1;
    });
    return hours;
  };

  // Top selling items
  const getTopItems = () => {
    const sales = {};
    filteredOrders.forEach(order => {
      if (!order.items) return;
      order.items.forEach(item => {
        const name = item.item_name || `Item ${item.item_id}`;
        sales[name] = (sales[name] || 0) + (item.quantity || 0);
      });
    });
    return Object.entries(sales)
      .map(([name, s]) => ({ name, sales: s }))
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
          No orders found for the selected period. Try selecting "All Time".
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
                <Bar yAxisId="left"  dataKey="orders"  fill="#2563EB" name="Orders"      radius={[4,4,0,0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="Revenue (₹)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Sales */}
          <div className="chart-card">
            <h3>Sales by Category (₹)</h3>
            {categoryData.length === 0 ? (
              <p className="no-results">No category data</p>
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

          {/* Peak Hours */}
          <div className="chart-card">
            <h3>Peak Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fontSize: 10 }} interval={2} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} allowDecimals={false} />
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