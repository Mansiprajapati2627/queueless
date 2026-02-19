export const formatters = {
  currency: (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  },

  date: (dateString, format = 'medium') => {
    const date = new Date(dateString);
    
    const formats = {
      short: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      medium: {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      },
      long: {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    };

    return date.toLocaleDateString('en-IN', formats[format]);
  },

  time: (dateString, format = 'short') => {
    const date = new Date(dateString);
    
    const formats = {
      short: {
        hour: '2-digit',
        minute: '2-digit'
      },
      long: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    };

    return date.toLocaleTimeString('en-IN', formats[format]);
  },

  datetime: (dateString) => {
    const date = new Date(dateString);
    return `${formatters.date(date)} ${formatters.time(date)}`;
  },

  relativeTime: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatters.date(date);
  },

  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{5})(\d{5})$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return phone;
  },

  orderId: (id) => {
    return `#${id}`;
  },

  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str, length = 50) => {
    if (str.length <= length) return str;
    return str.substr(0, length) + '...';
  },

  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};