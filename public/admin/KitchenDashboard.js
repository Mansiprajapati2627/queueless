import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const KitchenDashboard = ({ user, orders, updateOrderStatus, onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('preparing');
  const [preparationTime, setPreparationTime] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders by status
  const pendingOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed'
  );
  
  const preparingOrders = orders.filter(order => 
    order.status === 'preparing'
  );
  
  const readyOrders = orders.filter(order => 
    order.status === 'ready'
  );
  
  const servedOrders = orders.filter(order => 
    order.status === 'served'
  );

  // Filter by search term
  const filterOrders = (orderList) => {
    if (!searchTerm) return orderList;
    
    return orderList.filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableNumber.toString().includes(searchTerm) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleStartPreparation = (orderId) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleMarkReady = (orderId) => {
    updateOrderStatus(orderId, 'ready');
  };

  const handleMarkServed = (orderId) => {
    updateOrderStatus(orderId, 'served');
  };

  const handleCompleteOrder = (orderId) => {
    updateOrderStatus(orderId, 'completed');
  };

  const getOrderTime = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m ago`;
    }
  };

  const renderOrderCard = (order, status) => (
    <div key={order.id} className="order-card" style={{ 
      borderLeft: `4px solid ${
        status === 'pending' ? '#ff9800' :
        status === 'preparing' ? '#4CAF50' :
        status === 'ready' ? '#8BC34A' :
        '#673ab7'
      }`
    }}>
      <div className="order-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
            <h3 className="order-id" style={{ margin: 0 }}>{order.id}</h3>
            <span style={{ 
              fontSize: '0.75rem', 
              background: 'var(--gray-100)', 
              padding: '2px 8px', 
              borderRadius: '12px',
              color: 'var(--gray-600)'
            }}>
              {getOrderTime(order.createdAt)}
            </span>
          </div>
          <p className="order-time" style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)' }}>
            <i className="fas fa-chair" style={{ marginRight: '4px' }}></i>
            Table {order.tableNumber} • 
            <i className="fas fa-clock" style={{ marginLeft: '12px', marginRight: '4px' }}></i>
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="order-status" style={{ 
          background: status === 'pending' ? '#ff980020' :
                    status === 'preparing' ? '#4CAF5020' :
                    status === 'ready' ? '#8BC34A20' :
                    '#673ab720',
          color: status === 'pending' ? '#ff9800' :
                status === 'preparing' ? '#4CAF50' :
                status === 'ready' ? '#8BC34A' :
                '#673ab7',
          fontSize: '0.75rem',
          fontWeight: '600',
          padding: '4px 12px',
          borderRadius: '12px',
          textTransform: 'uppercase'
        }}>
          {status}
        </div>
      </div>
      
      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item" style={{ padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                background: item.category === 'nonveg' ? 'var(--blush)' : 'var(--sage)',
                flexShrink: 0
              }}></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                  Quantity: {item.quantity} • Category: {item.category}
                </div>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--sage)' }}>
                ₹{item.price * item.quantity}
              </div>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <i className="fas fa-sticky-note" style={{ color: 'var(--primary)', marginTop: '2px' }}></i>
            <div>
              <div style={{ fontWeight: '500', color: 'var(--charcoal)', marginBottom: '2px' }}>Special Instructions:</div>
              <div style={{ color: 'var(--gray-600)' }}>{order.instructions}</div>
            </div>
          </div>
        </div>
      )}

      <div className="order-footer" style={{ paddingTop: '12px' }}>
        <div className="order-total" style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--primary)' }}>
          ₹{order.total}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {status === 'pending' && (
            <button
              onClick={() => handleStartPreparation(order.id)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="fas fa-play"></i> Start Cooking
            </button>
          )}
          {status === 'preparing' && (
            <button
              onClick={() => handleMarkReady(order.id)}
              className="btn btn-success btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="fas fa-check"></i> Mark Ready
            </button>
          )}
          {status === 'ready' && (
            <button
              onClick={() => handleMarkServed(order.id)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="fas fa-truck"></i> Mark Served
            </button>
          )}
          {status === 'served' && (
            <button
              onClick={() => handleCompleteOrder(order.id)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="fas fa-flag-checkered"></i> Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gray-50)'
    }}>
      {/* Kitchen Header */}
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
                background: 'var(--secondary)',
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
                Queueless Kitchen
              </span>
            </Link>
            <span style={{
              background: 'var(--secondary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              KITCHEN PANEL
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)'
              }}></i>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '0.875rem',
                  width: '200px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '500', color: 'var(--charcoal)' }}>Chef {user?.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--charcoal-light)' }}>Kitchen Staff</div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--secondary)',
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
        </div>
      </header>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Stats Bar */}
        <div className="features-grid" style={{ marginBottom: '2rem' }}>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#ff980020', color: '#ff9800' }}>
              <i className="fas fa-clock"></i>
            </div>
            <h3>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ff9800' }}>
              {pendingOrders.length}
            </p>
            <small style={{ color: 'var(--charcoal-light)' }}>Waiting to cook</small>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#4CAF5020', color: '#4CAF50' }}>
              <i className="fas fa-fire"></i>
            </div>
            <h3>Cooking</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4CAF50' }}>
              {preparingOrders.length}
            </p>
            <small style={{ color: 'var(--charcoal-light)' }}>In preparation</small>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#8BC34A20', color: '#8BC34A' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Ready</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8BC34A' }}>
              {readyOrders.length}
            </p>
            <small style={{ color: 'var(--charcoal-light)' }}>Ready to serve</small>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#673ab720', color: '#673ab7' }}>
              <i className="fas fa-truck"></i>
            </div>
            <h3>Served</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#673ab7' }}>
              {servedOrders.length}
            </p>
            <small style={{ color: 'var(--charcoal-light)' }}>At table</small>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          borderBottom: '2px solid var(--border)',
          paddingBottom: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`btn ${selectedTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          >
            <i className="fas fa-clock"></i> Pending ({pendingOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('preparing')}
            className={`btn ${selectedTab === 'preparing' ? 'btn-primary' : 'btn-outline'}`}
          >
            <i className="fas fa-fire"></i> Cooking ({preparingOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('ready')}
            className={`btn ${selectedTab === 'ready' ? 'btn-primary' : 'btn-outline'}`}
          >
            <i className="fas fa-check-circle"></i> Ready ({readyOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('served')}
            className={`btn ${selectedTab === 'served' ? 'btn-primary' : 'btn-outline'}`}
          >
            <i className="fas fa-truck"></i> Served ({servedOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`btn ${selectedTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ marginLeft: 'auto' }}
          >
            <i className="fas fa-list"></i> View All
          </button>
        </div>

        {/* Orders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Pending Orders */}
          {(selectedTab === 'pending' || selectedTab === 'all') && filterOrders(pendingOrders).map(order => 
            renderOrderCard(order, 'pending')
          )}
          
          {/* Preparing Orders */}
          {(selectedTab === 'preparing' || selectedTab === 'all') && filterOrders(preparingOrders).map(order => 
            renderOrderCard(order, 'preparing')
          )}
          
          {/* Ready Orders */}
          {(selectedTab === 'ready' || selectedTab === 'all') && filterOrders(readyOrders).map(order => 
            renderOrderCard(order, 'ready')
          )}
          
          {/* Served Orders */}
          {(selectedTab === 'served' || selectedTab === 'all') && filterOrders(servedOrders).map(order => 
            renderOrderCard(order, 'served')
          )}
        </div>

        {selectedTab !== 'all' && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--charcoal-light)' }}>
              Showing {filterOrders(
                selectedTab === 'pending' ? pendingOrders :
                selectedTab === 'preparing' ? preparingOrders :
                selectedTab === 'ready' ? readyOrders : servedOrders
              ).length} orders
            </p>
          </div>
        )}

        {/* Empty State */}
        {selectedTab === 'pending' && filterOrders(pendingOrders).length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow)'
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
            <h3>No Pending Orders</h3>
            <p style={{ color: 'var(--charcoal-light)', marginBottom: '1.5rem' }}>
              All orders are being processed. Great work!
            </p>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '1rem',
          zIndex: 100
        }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <i className="fas fa-external-link-alt"></i>
            View Site
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <i className="fas fa-crown"></i>
            Admin View
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;