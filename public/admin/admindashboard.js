import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 12.99, stock: 50 },
    { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99, stock: 45 },
    { id: 3, name: 'Caesar Salad', category: 'Salads', price: 8.99, stock: 30 },
    { id: 4, name: 'Garlic Bread', category: 'Appetizers', price: 5.99, stock: 60 },
    { id: 5, name: 'Coca-Cola', category: 'Beverages', price: 2.99, stock: 100 },
    { id: 6, name: 'Chocolate Brownie', category: 'Desserts', price: 6.99, stock: 25 },
  ]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    // Check if user is admin
    const adminData = localStorage.getItem('queueless_admin');
    if (!adminData) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadOrders();
  }, [navigate]);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('queueless_orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      // Sort by latest first
      setOrders(allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const savedOrders = localStorage.getItem('queueless_orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      const updatedOrders = allOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status: newStatus,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                message: `Status updated to ${newStatus}`
              }
            ]
          };
          return updatedOrder;
        }
        return order;
      });
      
      localStorage.setItem('queueless_orders', JSON.stringify(updatedOrders));
      loadOrders();
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    }
  };

  const updateMenuItem = (id, field, value) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    toast.success('Menu updated');
  };

  const handleLogout = () => {
    localStorage.removeItem('queueless_admin');
    localStorage.removeItem('queueless_user');
    navigate('/');
    toast.success('Logged out from admin');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#10b981';
      case 'served': return '#8b5cf6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (!admin) return null;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <i className="fas fa-qrcode"></i>
          <h1>Queueless <span className="admin-badge">Admin</span></h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-info">
            <i className="fas fa-user-shield"></i>
            <span>{admin.name}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button 
          className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <i className="fas fa-clipboard-list"></i> Orders
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <i className="fas fa-utensils"></i> Menu
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <i className="fas fa-chart-bar"></i> Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2><i className="fas fa-clipboard-list"></i> Recent Orders</h2>
            <div className="orders-grid">
              {orders.length === 0 ? (
                <div className="no-orders">
                  <i className="fas fa-inbox"></i>
                  <p>No orders yet</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>Order #{order.id}</strong>
                        <span className="table-tag">Table {order.tableNumber}</span>
                      </div>
                      <div className="order-time">
                        {new Date(order.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-footer">
                      <div className="order-total">
                        Total: <strong>${order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-actions">
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={order.status !== 'pending'}
                        className="btn btn-sm btn-primary"
                      >
                        Start Preparing
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={order.status !== 'preparing'}
                        className="btn btn-sm btn-success"
                      >
                        Mark as Ready
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        disabled={order.status !== 'ready'}
                        className="btn btn-sm btn-purple"
                      >
                        Mark as Served
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        disabled={order.status === 'completed'}
                        className="btn btn-sm btn-secondary"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="menu-section">
            <h2><i className="fas fa-utensils"></i> Menu Management</h2>
            <div className="menu-table-container">
              <table className="menu-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <select 
                          value={item.category}
                          onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                          className="form-select"
                        >
                          <option value="Pizza">Pizza</option>
                          <option value="Salads">Salads</option>
                          <option value="Appetizers">Appetizers</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Desserts">Desserts</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(item.id, 'price', parseFloat(e.target.value))}
                          step="0.01"
                          min="0"
                          className="form-input"
                        />
                      </td>
                      <td>
                        <input 
                          type="number"
                          value={item.stock}
                          onChange={(e) => updateMenuItem(item.id, 'stock', parseInt(e.target.value))}
                          min="0"
                          className="form-input"
                        />
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2><i className="fas fa-chart-bar"></i> Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-content">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-content">
                  <h3>${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-content">
                  <h3>{orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}</h3>
                  <p>Active Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{orders.filter(o => o.status === 'completed').length}</h3>
                  <p>Completed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-footer">
        <p>© 2024 Queueless Admin Dashboard v1.0.0</p>
      </div>
    </div>
  );
};

export default AdminDashboard;