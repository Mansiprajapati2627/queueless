import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';
import { Search, Filter, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.order_id.toString().includes(searchTerm) ||
        o.table_id?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.order_status === statusFilter);
    }

    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(o => new Date(o.order_time).toDateString() === now.toDateString());
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(o => new Date(o.order_time) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(o => new Date(o.order_time) >= monthAgo);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      console.log(`Updating order ${orderId} to ${newStatus}`);
      await api.patch(`/orders/${orderId}/status`, { order_status: newStatus });
      await loadOrders(); // reload to reflect changes
    } catch (error) {
      console.error('Failed to update order status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
      alert('Failed to update order status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
            placeholder="Search by Order ID or Table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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
          <strong>{formatCurrency(filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0))}</strong>
        </div>
        <div className="summary-card">
          <span>Pending</span>
          <strong>{filteredOrders.filter(o => o.order_status === 'pending').length}</strong>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
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
                <React.Fragment key={order.order_id}>
                  <tr>
                    <td className="expand-cell">
                      <button className="expand-btn" onClick={() => toggleExpand(order.order_id)}>
                        {expandedOrder === order.order_id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                    <td className="order-id">#{order.order_id}</td>
                    <td>Table {order.table_id}</td>
                    <td><span className="items-count">{order.items?.length || 0} items</span></td>
                    <td className="order-total">{formatCurrency(order.total_amount)}</td>
                    <td><OrderStatusBadge status={order.order_status} /></td>
                    <td>{new Date(order.order_time).toLocaleString()}</td>
                    <td>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        disabled={updating[order.order_id]}
                        className="status-select"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedOrder === order.order_id && (
                    <tr className="expanded-row">
                      <td colSpan="8">
                        <div className="order-details">
                          <h4>Order Items</h4>
                          <table className="order-items-table">
                            <thead>
                              <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
                            </thead>
                            <tbody>
                              {order.items?.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.menu_item?.item_name || `Item ${item.item_id}`}</td>
                                  <td>{item.quantity}</td>
                                  <td>{formatCurrency(item.price)}</td>
                                  <td>{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="order-meta">
                            <p><strong>User:</strong> {order.user?.name || `User ID: ${order.user_id}`}</p>
                            <p><strong>Order Type:</strong> {order.order_type}</p>
                            <p><strong>Order Time:</strong> {new Date(order.order_time).toLocaleString()}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr><td colSpan="8" className="no-results">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;