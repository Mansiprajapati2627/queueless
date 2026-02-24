import React from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useCart } from '../../hooks/useCart';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatCurrency } from '../../utils/helpers';

const OrderTrackingPage = () => {
  const { orders } = useOrders();
  const { tableNumber } = useCart();

  const currentOrders = orders.filter(o => o.table === tableNumber && o.status !== 'completed');
  const pastOrders = orders.filter(o => o.table === tableNumber && o.status === 'completed');

  return (
    <div className="tracking-page">
      <h2>Your Orders</h2>
      {currentOrders.length === 0 && <p>No active orders.</p>}
      {currentOrders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.id}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.quantity} x {item.name}</li>
            ))}
          </ul>
          <div className="order-total">Total: {formatCurrency(order.total)}</div>
        </div>
      ))}

      {pastOrders.length > 0 && (
        <>
          <h3>Order History</h3>
          {pastOrders.map(order => (
            <div key={order.id} className="order-card past">
              <div className="order-header">
                <span>Order #{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderTrackingPage;