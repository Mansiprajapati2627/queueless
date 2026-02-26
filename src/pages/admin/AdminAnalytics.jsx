import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { dummyOrders, dummyMenu } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/helpers';
import { Calendar, Download } from 'lucide-react';

// Generate sample data
const generateDailyOrders = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    orders: Math.floor(Math.random() * 30) + 10,
    revenue: Math.floor(Math.random() * 5000) + 2000
  }));
};

const generateCategorySales = () => {
  const categories = ['Snacks', 'Meals', 'Drinks', 'Desserts'];
  return categories.map(cat => ({
    category: cat,
    sales: Math.floor(Math.random() * 100) + 30,
    revenue: Math.floor(Math.random() * 20000) + 5000
  }));
};

const generateHourlyOrders = () => {
  const hours = ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];
  return hours.map(hour => ({
    hour,
    orders: Math.floor(Math.random() * 15) + 2
  }));
};

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [dailyData] = useState(generateDailyOrders());
  const [categoryData] = useState(generateCategorySales());
  const [hourlyData] = useState(generateHourlyOrders());

  // Real data from orders (if any)
  const totalOrders = dummyOrders.length;
  const totalRevenue = dummyOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const popularItems = dummyMenu.slice(0, 5);

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
            </select>
          </div>
          <button className="export-btn">
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
          <span className="metric-value">{popularItems.length}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Daily Orders Chart */}
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
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales */}
        <div className="chart-card">
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="sales"
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
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

        {/* Top Items Table */}
        <div className="chart-card">
          <h3>Top Selling Items</h3>
          <table className="top-items-table">
            <thead>
              <tr><th>Item</th><th>Category</th><th>Price</th></tr>
            </thead>
            <tbody>
              {popularItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;