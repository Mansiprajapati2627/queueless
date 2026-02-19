import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';

const OrderTrackingPage = ({ activeOrders, user, tableNumber }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    marginBottom: '30px'
  };

  const ordersListStyle = {
    display: 'grid',
    gap: '15px'
  };

  const orderCardStyle = {
    cursor: 'pointer',
    transition: 'transform 0.2s'
  };

  const orderHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const statusStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    background: status === 'pending' ? '#feebc8' :
                status === 'preparing' ? '#bee3f8' :
                status === 'ready' ? '#c6f6d5' : '#e2e8f0',
    color: status === 'pending' ? '#744210' :
           status === 'preparing' ? '#2c5282' :
           status === 'ready' ? '#22543d' : '#1a202c'
  });

  const statusIconStyle = (status) => ({
    fontSize: '24px',
    color: status === 'pending' ? '#ed8936' :
           status === 'preparing' ? '#4299e1' :
           status === 'ready' ? '#48bb78' : '#a0aec0'
  });

  const getStatusMessage = (status) => {
    const messages = {
      pending: 'Order placed, waiting for confirmation',
      confirmed: 'Order confirmed, preparing soon',
      preparing: 'Your food is being prepared',
      ready: 'Your order is ready to be served',
      completed: 'Order completed'
    };
    return messages[status] || 'Processing';
  };

  if (activeOrders.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="orders" size={64} />
          <h2 style={{ margin: '20px 0', color: '#666' }}>No Active Orders</h2>
          <p style={{ color: '#999', marginBottom: '30px' }}>You haven't placed any orders yet</p>
          <Link to="/menu">
            <Button icon="menu">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Your Orders</h1>
        <p style={{ color: '#666' }}>Table {tableNumber}</p>
      </div>

      <div style={ordersListStyle}>
        {activeOrders.map(order => (
          <Card key={order.id} onClick={() => setSelectedOrder(order)} style={orderCardStyle}>
            <div style={orderHeaderStyle}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>Order #{order.id}</h3>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span style={statusStyle(order.status)}>{order.status}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span style={statusIconStyle(order.status)}>
                <Icon name={order.status === 'pending' ? 'clock' : 
                          order.status === 'preparing' ? 'food' :
                          order.status === 'ready' ? 'check' : 'orders'} size={24} />
              </span>
              <p style={{ color: '#666', fontSize: '14px' }}>{getStatusMessage(order.status)}</p>
            </div>

            <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              {order.items.slice(0, 2).map((item, idx) => (
                <span key={idx}>
                  {item.quantity}x {item.name}
                  {idx < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
                </span>
              ))}
              {order.items.length > 2 && <span> +{order.items.length - 2} more</span>}
            </div>

            <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#667eea' }}>
              Total: ₹{order.total}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Status:</strong> <span style={statusStyle(selectedOrder.status)}>{selectedOrder.status}</span></p>
              <p><strong>Time:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Table:</strong> {selectedOrder.tableNumber}</p>
            </div>

            <h3 style={{ marginBottom: '10px' }}>Items</h3>
            <div style={{ marginBottom: '20px' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Tax</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Service Charge</span>
                <span>₹{selectedOrder.serviceCharge}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontWeight: 'bold', borderTop: '2px solid #e2e8f0', marginTop: '5px', paddingTop: '10px' }}>
                <span>Total</span>
                <span>₹{selectedOrder.total}</span>
              </div>
            </div>

            {selectedOrder.instructions && (
              <div>
                <h4>Special Instructions:</h4>
                <p style={{ background: '#f7fafc', padding: '10px', borderRadius: '4px' }}>{selectedOrder.instructions}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTrackingPage;