import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/orderService';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';
import { Search, Filter, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, dateFilter, orders]);

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

  const filterOrders = () => {
    let filtered = [...orders];

    // Search by order ID or table
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.table.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(o => new Date(o.createdAt).toDateString() === now.toDateString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(o => new Date(o.createdAt) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(o => new Date(o.createdAt) >= monthAgo);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    loadOrders(); // reload to get updated data
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Orders</h1>
        <button className="refresh-btn" onClick={loadOrders}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="orders-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order ID or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>

          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button className="reset-btn" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      <div className="orders-summary">
        <div className="summary-card">
          <span>Total Orders</span>
          <strong>{filteredOrders.length}</strong>
        </div>
        <div className="summary-card">
          <span>Total Revenue</span>
          <strong>{formatCurrency(filteredOrders.reduce((sum, o) => sum + o.total, 0))}</strong>
        </div>
        <div className="summary-card">
          <span>Pending</span>
          <strong>{filteredOrders.filter(o => o.status === 'pending').length}</strong>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>Table {order.table}</td>
                  <td>
                    <span className="items-count">{order.items.length} items</span>
                    <div className="items-preview">
                      {order.items.map((item, i) => (
                        <span key={i}>{item.quantity}x {item.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="order-total">{formatCurrency(order.total)}</td>
                  <td><OrderStatusBadge status={order.status} /></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;