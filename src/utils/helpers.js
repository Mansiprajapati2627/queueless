export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
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