export const dummyMenu = [
  { id: 1, name: 'Veg Spring Rolls', category: 'Snacks', price: 5.99, description: 'Crispy rolls with veggies', image: '/assets/spring-rolls.jpg' },
  { id: 2, name: 'Margherita Pizza', category: 'Meals', price: 12.99, description: 'Classic cheese pizza', image: '/assets/pizza.jpg' },
  { id: 3, name: 'Iced Latte', category: 'Drinks', price: 4.5, description: 'Chilled coffee with milk', image: '/assets/latte.jpg' },
  { id: 4, name: 'Chocolate Brownie', category: 'Desserts', price: 6.0, description: 'Warm brownie with ice cream', image: '/assets/brownie.jpg' },
  { id: 5, name: 'Chicken Burger', category: 'Meals', price: 10.0, description: 'Grilled chicken burger', image: '/assets/burger.jpg' },
];

export const dummyOrders = [
  { id: 'ORD001', table: 5, items: [{ name: 'Veg Spring Rolls', quantity: 2, price: 5.99 }], total: 11.98, status: 'pending', createdAt: '2025-02-24T10:00:00Z' },
  { id: 'ORD002', table: 12, items: [{ name: 'Margherita Pizza', quantity: 1, price: 12.99 }], total: 12.99, status: 'preparing', createdAt: '2025-02-24T10:15:00Z' },
];

export const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 45.97 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, totalSpent: 87.45 },
];