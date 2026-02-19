export const exportUtils = {
  toCSV: (data, headers, filename) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    exportUtils.download(csvContent, filename, 'text/csv');
  },

  toJSON: (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    exportUtils.download(jsonContent, filename, 'application/json');
  },

  toPDF: async (data, filename) => {
    // In a real app, use a PDF library like jsPDF
    console.log('PDF export would happen here');
    alert('PDF export feature coming soon!');
  },

  download: (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  prepareOrderData: (orders) => {
    return orders.map(order => ({
      'Order ID': order.id,
      'Table': order.tableNumber,
      'Customer': order.customerName || 'Guest',
      'Items': order.items?.length || 0,
      'Total': order.total,
      'Status': order.status,
      'Payment': order.paymentMethod || 'N/A',
      'Time': new Date(order.createdAt).toLocaleString()
    }));
  },

  prepareCustomerData: (customers) => {
    return customers.map(customer => ({
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Orders': customer.totalOrders || 0,
      'Total Spent': customer.totalSpent || 0,
      'Last Visit': customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'N/A'
    }));
  },

  prepareMenuData: (items) => {
    return items.map(item => ({
      'Name': item.name,
      'Category': item.category,
      'Price': item.price,
      'Availability': item.availability,
      'Description': item.description || ''
    }));
  }
};