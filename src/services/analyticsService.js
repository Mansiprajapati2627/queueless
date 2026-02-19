import { orderService } from './orderService';

export const analyticsService = {
  getAnalytics: (period = 'week') => {
    const orders = orderService.getOrders();
    
    return {
      revenue: analyticsService.calculateRevenue(orders, period),
      popularItems: analyticsService.getPopularItems(orders),
      orderStats: analyticsService.getOrderStats(orders),
      customerStats: analyticsService.getCustomerStats(orders),
      peakHours: analyticsService.getPeakHours(orders)
    };
  },

  calculateRevenue: (orders, period) => {
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch(period) {
        case 'day': return diffDays === 0;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        default: return true;
      }
    });

    return filtered.reduce((sum, order) => sum + order.total, 0);
  },

  getPopularItems: (orders) => {
    const itemCount = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },

  getOrderStats: (orders) => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      averageValue: orders.length > 0 
        ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
        : 0
    };
  },

  getCustomerStats: (orders) => {
    const uniqueCustomers = new Set(orders.map(o => o.customerEmail).filter(Boolean));
    
    return {
      total: uniqueCustomers.size,
      new: 0, // Would need customer creation date
      returning: 0 // Would need customer history
    };
  },

  getPeakHours: (orders) => {
    const hourCount = Array(24).fill(0);
    
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourCount[hour]++;
    });

    return hourCount;
  },

  exportReport: (period) => {
    const data = analyticsService.getAnalytics(period);
    const report = {
      generatedAt: new Date().toISOString(),
      period,
      ...data
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${period}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }
};