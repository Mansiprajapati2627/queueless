export const orderService = {
  getOrders: () => {
    const orders = localStorage.getItem('queueless_orders');
    return orders ? JSON.parse(orders) : [];
  },

  getActiveOrders: () => {
    const orders = orderService.getOrders();
    return orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  },

  placeOrder: (orderData) => {
    const orders = orderService.getOrders();
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem('queueless_orders', JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = orderService.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('queueless_orders', JSON.stringify(updated));
    return updated;
  },

  getOrderById: (orderId) => {
    const orders = orderService.getOrders();
    return orders.find(o => o.id === orderId);
  }
};