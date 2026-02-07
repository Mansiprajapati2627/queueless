import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = ({ user, orders, updateOrderStatus, onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  });
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Paneer Tikka', price: 280, category: 'veg', active: true, stock: 50 },
    { id: 2, name: 'Chicken Biryani', price: 350, category: 'nonveg', active: true, stock: 30 },
    { id: 3, name: 'Veg Burger', price: 180, category: 'veg', active: true, stock: 40 },
    { id: 4, name: 'Chicken Burger', price: 220, category: 'nonveg', active: true, stock: 25 },
    { id: 5, name: 'Cold Coffee', price: 120, category: 'beverages', active: true, stock: 100 },
    { id: 6, name: 'Chocolate Brownie', price: 150, category: 'desserts', active: true, stock: 35 }
  ]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'veg',
    stock: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
    );
    
    const completedOrders = orders.filter(order => 
      order.status === 'completed'
    );
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    setStats({
      totalRevenue,
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      averageOrderValue
    });
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const toggleMenuItem = (itemId) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, active: !item.active } : item
    ));
  };

  const handleAddMenuItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: menuItems.length + 1,
      name: newMenuItem.name,
      price: parseInt(newMenuItem.price),
      category: newMenuItem.category,
      stock: parseInt(newMenuItem.stock),
      active: true
    };
    setMenuItems([...menuItems, newItem]);
    setNewMenuItem({ name: '', price: '', category: 'veg', stock: '' });
    setShowAddForm(false);
  };

  const deleteMenuItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    }
  };

  const updateStock = (itemId, newStock) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, stock: parseInt(newStock) } : item
    ));
  };

  const renderOverview = () => (
    <div>
      {/* Stats Cards */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'var(--primary)', color: 'white' }}>
            <i className="fas fa-rupee-sign"></i>
          </div>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
            ₹{stats.totalRevenue.toFixed(2)}
          </p>
          <small style={{ color: 'var(--charcoal-light)' }}>All Time</small>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'var(--success)', color: 'white' }}>
            <i className="fas fa-shopping-bag"></i>
          </div>
          <h3>Today's Orders</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
            {stats.todayOrders}
          </p>
          <small style={{ color: 'var(--charcoal-light)' }}>Orders today</small>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'var(--warning)', color: 'white' }}>
            <i className="fas fa-clock"></i>
          </div>
          <h3>Pending Orders</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
            {stats.pendingOrders}
          </p>
          <small style={{ color: 'var(--charcoal-light)' }}>Need attention</small>
        </div>
        <div className="feature-card">
          <div className="feature-icon" style={{ background: 'var(--secondary)', color: 'white' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Completed</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
            {stats.completedOrders}
          </p>
          <small style={{ color: 'var(--charcoal-light)' }}>Successful orders</small>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Orders</h3>
          <Link to="/admin/dashboard?tab=orders" onClick={() => setSelectedTab('orders')} style={{ color: 'var(--primary)' }}>
            View All →
          </Link>
        </div>
        <div className="orders-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {orders.slice(-5).reverse().map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-id" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{order.id}</h3>
                  <p className="order-time" style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                    {new Date(order.createdAt).toLocaleDateString()} • Table {order.tableNumber}
                  </p>
                </div>
                <div className="order-status" style={{ 
                  background: order.status === 'completed' ? 'var(--success-light)' : 
                            order.status === 'pending' ? 'var(--warning-light)' : 'var(--primary-light)',
                  color: order.status === 'completed' ? 'var(--success-dark)' : 
                        order.status === 'pending' ? 'var(--warning-dark)' : 'var(--primary-dark)',
                  fontSize: '0.75rem',
                  padding: '4px 8px'
                }}>
                  {order.status.toUpperCase()}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="order-item" style={{ padding: '8px 0', fontSize: '0.875rem' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="order-item" style={{ padding: '8px 0', fontSize: '0.875rem' }}>
                    <span>+{order.items.length - 2} more items</span>
                  </div>
                )}
              </div>
              
              <div className="order-footer" style={{ paddingTop: '12px' }}>
                <div className="order-total" style={{ fontSize: '1rem', fontWeight: '600' }}>
                  ₹{order.total}
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.875rem',
                    background: 'white',
                    minWidth: '120px'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${selectedTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedTab('all')}
        >
          All Orders ({orders.length})
        </button>
        <button 
          className={`btn ${selectedTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedTab('pending')}
        >
          Pending ({stats.pendingOrders})
        </button>
        <button 
          className={`btn ${selectedTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedTab('completed')}
        >
          Completed ({stats.completedOrders})
        </button>
      </div>
      
      <div className="orders-list">
        {orders
          .filter(order => {
            if (selectedTab === 'pending') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
            if (selectedTab === 'completed') return order.status === 'completed';
            return true;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 className="order-id">{order.id}</h3>
                  <p className="order-time">
                    {new Date(order.createdAt).toLocaleDateString()} • 
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                    Table {order.tableNumber}
                  </p>
                </div>
                <div className="order-status" style={{ 
                  background: order.status === 'completed' ? 'var(--success-light)' : 
                            order.status === 'pending' ? 'var(--warning-light)' : 
                            order.status === 'ready' ? 'var(--info-light)' : 'var(--primary-light)',
                  color: order.status === 'completed' ? 'var(--success-dark)' : 
                        order.status === 'pending' ? 'var(--warning-dark)' : 
                        order.status === 'ready' ? 'var(--info-dark)' : 'var(--primary-dark)'
                }}>
                  {order.status.toUpperCase()}
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%',
                        background: item.category === 'nonveg' ? 'var(--blush)' : 'var(--sage)'
                      }}></span>
                      <span>{item.name} × {item.quantity}</span>
                    </div>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.instructions && (
                <div style={{
                  background: 'var(--gray-100)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius-sm)',
                  margin: '12px 0',
                  fontSize: '0.875rem'
                }}>
                  <strong style={{ color: 'var(--charcoal)' }}>Instructions:</strong> {order.instructions}
                </div>
              )}
              
              <div className="order-footer">
                <div className="order-total" style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)' }}>
                  ₹{order.total}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: '0.875rem',
                      background: 'white',
                      minWidth: '140px'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Menu Management</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ 
          background: 'var(--gray-100)', 
          padding: '1.5rem', 
          borderRadius: 'var(--border-radius)',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New Menu Item</h4>
          <form onSubmit={handleAddMenuItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Item Name</label>
                <input
                  type="text"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                  placeholder="e.g., Pizza Margherita"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Price (₹)</label>
                <input
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                  placeholder="e.g., 300"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Category</label>
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'white'
                  }}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Stock Quantity</label>
                <input
                  type="number"
                  value={newMenuItem.stock}
                  onChange={(e) => setNewMenuItem({...newMenuItem, stock: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)'
                  }}
                  placeholder="e.g., 50"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add to Menu
            </button>
          </form>
        </div>
      )}

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-card">
            <div className="menu-item-content">
              <div className="menu-item-header">
                <h3 className="item-name">{item.name}</h3>
                <span className="item-price">₹{item.price}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <span className="item-category" style={{ 
                  background: item.category === 'veg' ? 'var(--sage-light)' : 
                            item.category === 'nonveg' ? 'var(--blush-light)' : 'var(--gray-100)',
                  color: item.category === 'veg' ? 'var(--sage-dark)' : 
                        item.category === 'nonveg' ? 'var(--blush-dark)' : 'var(--gray-600)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {item.category}
                </span>
                <span style={{ 
                  background: item.stock > 10 ? 'var(--success-light)' : 'var(--warning-light)',
                  color: item.stock > 10 ? 'var(--success-dark)' : 'var(--warning-dark)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  Stock: {item.stock}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => toggleMenuItem(item.id)}
                  className={`btn btn-sm ${item.active ? 'btn-secondary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  {item.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="btn btn-sm"
                  style={{ 
                    background: 'var(--accent-light)', 
                    color: 'var(--blush-dark)',
                    border: 'none'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '4px', display: 'block' }}>
                  Update Stock:
                </label>
                <input
                  type="number"
                  value={item.stock}
                  onChange={(e) => updateStock(item.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <div style={{ 
        background: 'var(--white)', 
        padding: '1.5rem', 
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Revenue Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Average Order Value</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>₹{stats.averageOrderValue.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Total Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>{orders.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Completion Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
              {orders.length > 0 ? ((stats.completedOrders / orders.length) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'var(--white)', 
        padding: '1.5rem', 
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Order Status Distribution</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--warning-light)', 
              color: 'var(--warning-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: '0 auto 0.5rem'
            }}>
              {stats.pendingOrders}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--primary-light)', 
              color: 'var(--primary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: '0 auto 0.5rem'
            }}>
              {orders.filter(o => o.status === 'preparing').length}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Preparing</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--info-light)', 
              color: 'var(--info-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: '0 auto 0.5rem'
            }}>
              {orders.filter(o => o.status === 'ready').length}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Ready</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--success-light)', 
              color: 'var(--success-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              margin: '0 auto 0.5rem'
            }}>
              {stats.completedOrders}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Completed</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gray-50)'
    }}>
      {/* Admin Header */}
      <header style={{
        background: 'var(--white)',
        padding: '1rem 2rem',
        boxShadow: 'var(--shadow)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'var(--primary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                Q
              </div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--charcoal)'
              }}>
                Queueless Admin
              </span>
            </Link>
            <span style={{
              background: 'var(--primary-light)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              ADMIN PANEL
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '500', color: 'var(--charcoal)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)' }}>{user?.role}</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="btn btn-sm btn-secondary"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          flexShrink: 0,
          marginRight: '2rem'
        }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedTab('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: selectedTab === 'overview' ? 'var(--primary)' : 'transparent',
                  color: selectedTab === 'overview' ? 'white' : 'var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-chart-line"></i>
                Dashboard
              </button>
              <button
                onClick={() => setSelectedTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: selectedTab === 'orders' ? 'var(--primary)' : 'transparent',
                  color: selectedTab === 'orders' ? 'white' : 'var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-list"></i>
                Orders
              </button>
              <button
                onClick={() => setSelectedTab('menu')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: selectedTab === 'menu' ? 'var(--primary)' : 'transparent',
                  color: selectedTab === 'menu' ? 'white' : 'var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-utensils"></i>
                Menu
              </button>
              <button
                onClick={() => setSelectedTab('analytics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: selectedTab === 'analytics' ? 'var(--primary)' : 'transparent',
                  color: selectedTab === 'analytics' ? 'white' : 'var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-chart-bar"></i>
                Analytics
              </button>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--charcoal)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-external-link-alt"></i>
                  View Main Site
                </button>
                <button
                  onClick={() => navigate('/kitchen/dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--charcoal)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    width: '100%',
                    marginTop: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-utensils"></i>
                  Kitchen View
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          <div style={{ 
            background: 'var(--white)', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '2rem',
            boxShadow: 'var(--shadow)',
            minHeight: 'calc(100vh - 200px)'
          }}>
            {/* Content */}
            {selectedTab === 'overview' && renderOverview()}
            {selectedTab === 'orders' && renderOrders()}
            {selectedTab === 'menu' && renderMenu()}
            {selectedTab === 'analytics' && renderAnalytics()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;