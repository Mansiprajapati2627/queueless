export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  phone: (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  },

  password: (password) => {
    return password.length >= 6;
  },

  tableNumber: (tableNum) => {
    const num = parseInt(tableNum);
    return !isNaN(num) && num >= 1 && num <= 25;
  },

  price: (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
  },

  quantity: (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= 1 && num <= 100;
  },

  upiId: (upiId) => {
    const regex = /^[\w\.\-]+@[\w\.\-]+$/;
    return regex.test(upiId);
  },

  required: (value) => {
    return value !== undefined && value !== null && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  range: (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  }
};