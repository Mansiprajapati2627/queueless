import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../services/orderService';
import { dummyCustomers } from '../../utils/dummyData';
import LoadingSpinner from '../../components/LoadingSpinner';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, Clock, 
  Calendar, ChevronRight, Award 
} from 'lucide-react';

// Dummy data for charts
const generateRevenueData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    revenue: Math.floor(Math.random() * 5000) + 2000,
    orders: Math.floor(Math.random() * 30) + 10
  }));
};

const generateTopItems = () => {
  const items = [
    { name: 'Margherita Pizza', sales: 42, revenue: 1250 },
    { name: 'Chicken Wings', sales: 38, revenue: 950 },
    { name: 'Veg Spring Rolls', sales: 35, revenue: 700 },
    { name: 'Chocolate Brownie', sales: 28, revenue: 560 },
    { name: 'Iced Latte', sales: 25, revenue: 375 },
  ];
  const maxSales = Math.max(...items.map(i => i.sales));
  return items.map(item => ({
    ...item,
    percentage: (item.sales / maxSales) * 100
  }));
};

const statusData = [
  { name: 'Pending', value: 12, color: '#fbbf24' },
  { name: 'Preparing', value: 8, color: '#f97316' },
  { name: 'Ready', value: 5, color: '#10b981' },
  { name: 'Completed', value: 15, color: '#6b7280' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueData] = useState(generateRevenueData());
  const [topItems] = useState(generateTopItems());

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Calculate metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const todayOrders = orders.filter(o => 
    new Date(o.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalCustomers = dummyCustomers.length;

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome back, Admin</p>
        </div>
        <div className="date-badge">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon"><TrendingUp size={24} /></div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">{formatCurrency(totalRevenue)}</p>
            <span className="metric-trend">+12.5% from last week</span>
          </div>
        </div>
        <div className="metric-card orders">
          <div className="metric-icon"><ShoppingBag size={24} /></div>
          <div className="metric-content">
            <h3>Today's Orders</h3>
            <p className="metric-value">{todayOrders}</p>
            <span className="metric-trend">{orders.length} total orders</span>
          </div>
        </div>
        <div className="metric-card pending">
          <div className="metric-icon"><Clock size={24} /></div>
          <div className="metric-content">
            <h3>Pending</h3>
            <p className="metric-value">{pendingOrders}</p>
            <span className="metric-trend">Need attention</span>
          </div>
        </div>
        <div className="metric-card customers">
          <div className="metric-icon"><Users size={24} /></div>
          <div className="metric-content">
            <h3>Customers</h3>
            <p className="metric-value">{totalCustomers}</p>
            <span className="metric-trend">+3 this week</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Top Items */}
      <div className="dashboard-bottom">
        <div className="recent-orders-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <a href="/admin/orders" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/admin/orders'); }}>
              View All <ChevronRight size={16} />
            </a>
          </div>
          <table className="recent-orders-table">
            <thead>
              <tr><th>Order ID</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>Table {order.table}</td>
                  <td>{order.items.length} items</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td><OrderStatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="top-items-card">
          <div className="card-header">
            <h3>Top Selling Items</h3>
            <Award size={20} className="header-icon" />
          </div>
          <div className="top-items-list">
            {topItems.map((item, index) => (
              <div key={index} className="top-item">
                <div className="item-info">
                  <span className="item-rank">{index + 1}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-sales">{item.sales} sold</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="item-revenue">{formatCurrency(item.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <button className="quick-action-btn" onClick={() => navigate('/admin/menu')}>Manage Menu</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/orders')}>View All Orders</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/customers')}>Customer List</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/analytics')}>Analytics Report</button>
      </div>
    </div>
  );
};

export default AdminDashboard;