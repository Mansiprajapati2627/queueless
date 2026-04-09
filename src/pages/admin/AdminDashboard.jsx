import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Clock, Users, Calendar, ChevronRight, Award, Eye, X } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';

const parseDate = (raw) => { if (!raw) return null; return new Date(raw); };
const toLocalKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const buildRevenueData = (orders) => {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = toLocalKey(d);
    result.push({ day: dayLabels[d.getDay()], key, revenue: 0, orders: 0 });
  }

  orders.forEach(o => {
    const d = parseDate(o.order_time);
    if (!d || isNaN(d.getTime())) return;
    const key = toLocalKey(d);
    const slot = result.find(r => r.key === key);
    if (slot) {
      slot.revenue += parseFloat(o.total_amount || 0);
      slot.orders  += 1;
    }
  });

  return result.map(({ day, revenue, orders }) => ({ day, revenue: Math.round(revenue * 100) / 100, orders }));
};

const statusConfig = [
  { name: 'Pending',   color: '#fbbf24' },
  { name: 'Accepted',  color: '#3b82f6' },
  { name: 'Preparing', color: '#f97316' },
  { name: 'Ready',     color: '#10b981' },
  { name: 'Completed', color: '#6b7280' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          api.get('/orders/'),
          api.get('/users/'),
        ]);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setUsers(Array.isArray(usersRes.data)  ? usersRes.data  : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const revenueData = useMemo(() => buildRevenueData(orders), [orders]);

  const topItems = useMemo(() => {
    const itemSales = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        const name = item.item_name || `Item ${item.item_id}`;
        itemSales[name] = (itemSales[name] || 0) + item.quantity;
      });
    });
    const sorted = Object.entries(itemSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales).slice(0, 5);
    const max = sorted.length ? sorted[0].sales : 1;
    return sorted.map(item => ({ ...item, percentage: (item.sales / max) * 100 }));
  }, [orders]);

  if (loading) return <LoadingSpinner />;

  const totalRevenue   = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const todayKey       = toLocalKey(new Date());
  const todayOrders    = orders.filter(o => { const d = parseDate(o.order_time); return d && !isNaN(d.getTime()) && toLocalKey(d) === todayKey; }).length;
  const pendingOrders  = orders.filter(o => o.order_status === 'pending').length;
  const totalCustomers = users.filter(u => u.role !== 'admin').length;

  const statusCounts = orders.reduce((acc, o) => { acc[o.order_status] = (acc[o.order_status] || 0) + 1; return acc; }, {});
  const pieData = statusConfig
    .map(s => ({ ...s, value: statusCounts[s.name.toLowerCase()] || 0 }))
    .filter(s => s.value > 0);

  // Recent orders — last 5 by date, no today-only restriction
  const recentOrders = [...orders]
    .filter(o => { const d = parseDate(o.order_time); return d && !isNaN(d.getTime()); })
    .sort((a, b) => parseDate(b.order_time) - parseDate(a.order_time))
    .slice(0, 5);

  const formatOrderTime = (raw) => {
    const d = parseDate(raw);
    if (!d || isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  };

  return (
    <div className="admin-dashboard">
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

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon"><TrendingUp size={24} /></div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">{formatCurrency(totalRevenue)}</p>
            <span className="metric-trend">All time</span>
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
            <h3>Pending Orders</h3>
            <p className="metric-value">{pendingOrders}</p>
            <span className="metric-trend">Need attention</span>
          </div>
        </div>
        <div className="metric-card customers">
          <div className="metric-icon"><Users size={24} /></div>
          <div className="metric-content">
            <h3>Customers</h3>
            <p className="metric-value">{totalCustomers}</p>
            <span className="metric-trend">Registered users</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
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
                data={pieData.length ? pieData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]}
                cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(pieData.length ? pieData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="recent-orders-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <a href="/admin/orders" className="view-all" onClick={(e) => { e.preventDefault(); navigate('/admin/orders'); }}>
              View All <ChevronRight size={16} />
            </a>
          </div>
          <div className="recent-orders-table-wrapper">
            <table className="recent-orders-table">
              <thead>
                <tr><th>Order ID</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? recentOrders.map(order => (
                  <tr key={order.order_id}>
                    <td className="order-id">#{order.order_id}</td>
                    <td>Table {order.table_id}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td><OrderStatusBadge status={order.order_status} /></td>
                    <td>
                      <button className="view-order-btn" onClick={() => { setSelectedOrder(order); setModalOpen(true); }}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="no-results">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="top-items-card">
          <div className="card-header">
            <h3>Top Selling Items</h3>
            <Award size={20} className="header-icon" />
          </div>
          <div className="top-items-list">
            {topItems.length > 0 ? topItems.map((item, idx) => (
              <div key={idx} className="top-item">
                <div className="item-info">
                  <span className="item-rank">{idx + 1}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-sales">{item.sales} sold</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            )) : (
              <div className="no-results">No orders yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions-grid">
        <button className="quick-action-btn" onClick={() => navigate('/admin/menu')}>Manage Menu</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/orders')}>View All Orders</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/customers')}>Customer List</button>
        <button className="quick-action-btn" onClick={() => navigate('/admin/analytics')}>Analytics Report</button>
      </div>

      {modalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content order-details-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            <div className="modal-header">
              <h2>Order Details</h2>
              <p>Order #{selectedOrder.order_id}</p>
            </div>
            <div className="modal-body">
              <div className="order-summary">
                <div className="summary-row"><span>Table:</span><strong>Table {selectedOrder.table_id}</strong></div>
                <div className="summary-row"><span>Status:</span><OrderStatusBadge status={selectedOrder.order_status} /></div>
                <div className="summary-row"><span>Total:</span><strong>{formatCurrency(selectedOrder.total_amount)}</strong></div>
                <div className="summary-row"><span>Order Type:</span><span>{selectedOrder.order_type}</span></div>
                <div className="summary-row"><span>Order Time:</span><span>{formatOrderTime(selectedOrder.order_time)}</span></div>
              </div>
              <h3>Items</h3>
              <table className="order-items-table">
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.item_name || `Item ${item.item_id}`}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;