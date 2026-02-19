export const customerService = {
  getCustomers: () => {
    const orders = orderService.getOrders();
    const customers = [];
    const seen = new Set();

    orders.forEach(order => {
      if (order.customerEmail && !seen.has(order.customerEmail)) {
        seen.add(order.customerEmail);
        customers.push({
          id: order.customerEmail,
          name: order.customerName || 'Guest',
          email: order.customerEmail,
          phone: order.customerPhone || 'N/A',
          totalOrders: orders.filter(o => o.customerEmail === order.customerEmail).length,
          totalSpent: orders
            .filter(o => o.customerEmail === order.customerEmail)
            .reduce((sum, o) => sum + o.total, 0),
          lastVisit: order.createdAt,
          status: 'active'
        });
      }
    });

    return customers;
  },

  getCustomerById: (email) => {
    const customers = customerService.getCustomers();
    return customers.find(c => c.email === email);
  },

  deleteCustomer: (email) => {
    // In a real app, you'd mark customer as inactive
    // For demo, we'll just return success
    return true;
  },

  exportCustomers: (customers) => {
    const csv = convertToCSV(customers);
    downloadCSV(csv, 'customers_export.csv');
  }
};

const convertToCSV = (data) => {
  const headers = ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Visit'];
  const rows = data.map(c => [
    c.name,
    c.email,
    c.phone,
    c.totalOrders,
    c.totalSpent,
    new Date(c.lastVisit).toLocaleDateString()
  ]);
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};