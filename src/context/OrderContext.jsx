import React, { createContext, useState, useContext, useMemo } from 'react';
import { dummyOrders as initialOrders } from '../utils/dummyData';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(initialOrders);

  const createOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      ...orderDetails,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const getUserOrders = (userEmail) => {
    if (!userEmail) return [];
    return orders.filter(order => order.userEmail === userEmail);
  };

  const value = useMemo(() => ({
    orders,
    createOrder,
    updateOrderStatus,
    getUserOrders,
  }), [orders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => useContext(OrderContext);