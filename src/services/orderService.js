import api from './api';
import { dummyOrders } from '../utils/dummyData';

export const fetchOrders = () => {
  return Promise.resolve({ data: dummyOrders });
};

export const createOrder = (order) => {
  const newOrder = { id: Date.now().toString(), ...order, createdAt: new Date() };
  dummyOrders.push(newOrder);
  return Promise.resolve({ data: newOrder });
};

export const updateOrderStatus = (orderId, status) => {
  const order = dummyOrders.find(o => o.id === orderId);
  if (order) order.status = status;
  return Promise.resolve({ data: order });
};