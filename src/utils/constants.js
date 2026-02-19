export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved'
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  CASH: 'cash'
};

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@queueless.com', password: 'admin123' },
  kitchen: { email: 'kitchen@queueless.com', password: 'kitchen123' }
};

export const APP_CONFIG = {
  MAX_TABLE_NUMBER: 25,
  TAX_RATE: 0.05,
  SERVICE_CHARGE_RATE: 0.02
};