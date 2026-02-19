import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('queueless_orders');
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      setOrders(parsed);
      setActiveOrders(parsed.filter(o => !['completed', 'cancelled'].includes(o.status)));
    }
  }, []);

  const placeOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        message: 'Order placed'
      }],
      createdAt: new Date().toISOString()
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setActiveOrders(prev => [newOrder, ...prev]);
    localStorage.setItem('queueless_orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, message = '') => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const statusHistory = order.statusHistory || [];
        statusHistory.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          message: message || `Status updated to ${newStatus}`
        });
        return { ...order, status: newStatus, statusHistory };
      }
      return order;
    });
    setOrders(updatedOrders);
    setActiveOrders(updatedOrders.filter(o => !['completed', 'cancelled'].includes(o.status)));
    localStorage.setItem('queueless_orders', JSON.stringify(updatedOrders));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const value = {
    orders,
    activeOrders,
    placeOrder,
    updateOrderStatus,
    getOrderById
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};