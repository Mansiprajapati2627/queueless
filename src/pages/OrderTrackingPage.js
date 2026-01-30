import React, { useState, useEffect } from 'react';

const OrderTrackingPage = ({ activeOrders, getOrderById, user, tableNumber }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    // Load order history from localStorage
    const savedOrders = localStorage.getItem('queueless_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      const history = orders.filter(order => order.status === 'completed');
      setOrderHistory(history);
    }
  }, []);

  const statusIcons = {
    pending: 'fas fa-clock',
    confirmed: 'fas fa-check-circle',
    preparing: 'fas fa-utensils',
    ready: 'fas fa-check-circle',
    served: 'fas fa-truck',
    completed: 'fas fa-shopping-bag'
  };

  const statusLabels = {
    pending: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    completed: 'Completed'
  };

  const statusColors = {
    pending: 'var(--warning)',
    confirmed: 'var(--primary)',
    preparing: 'var(--primary-dark)',
    ready: 'var(--success)',
    served: 'var(--secondary)',
    completed: 'var(--gray-600)'
  };

  const renderTimeline = (order) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'];
    
    return (
      <div className="timeline">
        {statuses.map((status, index) => {
          const isActive = order.status === status;
          const isCompleted = order.statusHistory.some(h => h.status === status);
          
          return (
            <div key={status} className="timeline-item">
              <div className={`timeline-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}`} />
              <div className="timeline-content">
                <div className="timeline-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className={statusIcons[status]}></i>
                    <h4>{statusLabels[status]}</h4>
                  </div>
                  <span style={{ 
                    color: statusColors[status],
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {isActive ? 'Current' : isCompleted ? 'Done' : 'Pending'}
                  </span>
                </div>
                
                {order.statusHistory.find(h => h.status === status) && (
                  <p style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    {order.statusHistory.find(h => h.status === status)?.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleTrackOrder = (orderId) => {
    const order = getOrderById(orderId);
    setSelectedOrder(order);
  };

  return (
    <main className="main-content">
      <div className="orders-container">
        {/* Active Orders */}
        <div className="orders-section">
          <h2 className="section-title">Active Orders</h2>
          
          {activeOrders.length > 0 ? (
            <div className="orders-list">
              {activeOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3 className="order-id">{order.id}</h3>
                      <p className="order-time">
                        {new Date(order.createdAt).toLocaleDateString()} • 
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="badge" style={{ 
                        background: statusColors[order.status],
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem'
                      }}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="order-item">
                        <span>+{order.items.length - 2} more items</span>
                        <span></span>
                      </div>
                    )}
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">₹{order.total}</span>
                    </div>
                    
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-clock empty-state-icon"></i>
              <h3>No Active Orders</h3>
              <p>You don't have any active orders right now.</p>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="orders-section">
          <h2 className="section-title">Order History</h2>
          
          {orderHistory.length > 0 ? (
            <div className="orders-list">
              {orderHistory.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3 className="order-id">{order.id}</h3>
                      <p className="order-time">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="badge" style={{ 
                        background: 'var(--success)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem'
                      }}>
                        Completed
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">₹{order.total}</span>
                    </div>
                    
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-history empty-state-icon"></i>
              <h3>No Order History</h3>
              <p>Your completed orders will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Tracking</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-close"
                style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-info">
                <div style={{ 
                  background: 'var(--gray-100)', 
                  padding: '16px', 
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '24px'
                }}>
                  <div className="order-id" style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '1.125rem',
                    marginBottom: '8px'
                  }}>
                    {selectedOrder.id}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--gray-600)' }}>
                    <span>Table {selectedOrder.tableNumber}</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Timeline */}
                <h3 style={{ marginBottom: '16px' }}>Order Status</h3>
                {renderTimeline(selectedOrder)}

                {/* Estimated Time */}
                <div className="estimated-time" style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: 'var(--border-radius-lg)',
                  marginTop: '24px',
                  textAlign: 'center'
                }}>
                  <h4>Estimated Time</h4>
                  <div style={{ fontSize: '2rem', fontWeight: '700', margin: '8px 0' }}>
                    {selectedOrder.estimatedReadyTime} min
                  </div>
                  <p style={{ opacity: 0.9 }}>
                    Your food will be ready in approximately {selectedOrder.estimatedReadyTime} minutes
                  </p>
                </div>

                {/* Order Items */}
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ marginBottom: '12px' }}>Order Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--gray-200)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          × {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: '600' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrderTrackingPage;