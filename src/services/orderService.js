import api from './api';

export const fetchOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const fetchOrdersByUser = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('/orders', order);
  return response.data;
};
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { order_status: status });
  return response.data;
};