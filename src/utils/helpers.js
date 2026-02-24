export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#fbbf24';
    case 'preparing': return '#f97316';
    case 'ready': return '#10b981';
    case 'completed': return '#6b7280';
    default: return '#6b7280';
  }
};