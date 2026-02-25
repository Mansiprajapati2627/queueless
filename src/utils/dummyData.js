// Generate 25 items per category
const categories = ['Snacks', 'Meals', 'Drinks', 'Desserts'];
const snacks = [
  'Veg Spring Rolls', 'Chicken Wings', 'Onion Rings', 'French Fries', 'Nachos',
  'Samosa', 'Pakora', 'Bruschetta', 'Garlic Bread', 'Stuffed Mushrooms',
  'Mozzarella Sticks', 'Jalapeno Poppers', 'Chicken Tenders', 'Fish Fingers', 'Calamari',
  'Spring Rolls', 'Vegetable Cutlet', 'Paneer Tikka', 'Chicken Satay', 'Prawn Toast',
  'Cheese Balls', 'Potato Wedges', 'Onion Bhaji', 'Chilli Chicken', 'Gobi Manchurian'
];
const meals = [
  'Margherita Pizza', 'Chicken Burger', 'Veg Burger', 'Grilled Chicken', 'Fish & Chips',
  'Chicken Biryani', 'Veg Biryani', 'Pasta Alfredo', 'Pasta Arrabiata', 'Lasagna',
  'Steak', 'Grilled Salmon', 'Chicken Curry', 'Paneer Butter Masala', 'Dal Makhani',
  'Noodles', 'Fried Rice', 'Burrito', 'Tacos', 'Quesadilla',
  'Shawarma', 'Falafel Wrap', 'Meatball Sub', 'Club Sandwich', 'Caesar Salad'
];
const drinks = [
  'Iced Latte', 'Cappuccino', 'Mocha', 'Hot Chocolate', 'Espresso',
  'Green Tea', 'Masala Chai', 'Lemonade', 'Mango Smoothie', 'Strawberry Shake',
  'Oreo Shake', 'Cold Coffee', 'Fresh Lime Soda', 'Watermelon Juice', 'Orange Juice',
  'Pineapple Juice', 'Coke', 'Diet Coke', 'Sprite', 'Fanta',
  'Mint Mojito', 'Blue Lagoon', 'Virgin Mojito', 'Lassi', 'Buttermilk'
];
const desserts = [
  'Chocolate Brownie', 'Cheesecake', 'Tiramisu', 'Gulab Jamun', 'Ice Cream',
  'Chocolate Mousse', 'Panna Cotta', 'Fruit Tart', 'Apple Pie', 'Banoffee Pie',
  'Red Velvet Cake', 'Carrot Cake', 'Lava Cake', 'Rasmalai', 'Jalebi',
  'Kulfi', 'Gajar Ka Halwa', 'Falooda', 'Brownie Sundae', 'Waffles',
  'Pancakes', 'Donuts', 'Cinnamon Roll', 'Macarons', 'Cupcake'
];

export const dummyMenu = [
  ...snacks.map((name, index) => ({
    id: index + 1,
    name,
    category: 'Snacks',
    price: +(Math.random() * 8 + 4).toFixed(2), // random price between 4-12
    description: `Delicious ${name.toLowerCase()} made fresh.`,
    image: `/assets/food-${(index % 10) + 1}.jpg` // placeholder images
  })),
  ...meals.map((name, index) => ({
    id: 100 + index + 1,
    name,
    category: 'Meals',
    price: +(Math.random() * 12 + 8).toFixed(2), // 8-20
    description: `Hearty ${name.toLowerCase()} to satisfy your hunger.`,
    image: `/assets/food-${(index % 10) + 11}.jpg`
  })),
  ...drinks.map((name, index) => ({
    id: 200 + index + 1,
    name,
    category: 'Drinks',
    price: +(Math.random() * 5 + 2).toFixed(2), // 2-7
    description: `Refreshing ${name.toLowerCase()} to quench your thirst.`,
    image: `/assets/food-${(index % 10) + 21}.jpg`
  })),
  ...desserts.map((name, index) => ({
    id: 300 + index + 1,
    name,
    category: 'Desserts',
    price: +(Math.random() * 7 + 4).toFixed(2), // 4-11
    description: `Sweet ${name.toLowerCase()} to end your meal perfectly.`,
    image: `/assets/food-${(index % 10) + 31}.jpg`
  }))
];

export const dummyOrders = [
  { id: 'ORD001', table: 5, items: [{ name: 'Veg Spring Rolls', quantity: 2, price: 5.99 }], total: 11.98, status: 'pending', createdAt: '2025-02-24T10:00:00Z' },
  { id: 'ORD002', table: 12, items: [{ name: 'Margherita Pizza', quantity: 1, price: 12.99 }], total: 12.99, status: 'preparing', createdAt: '2025-02-24T10:15:00Z' },
];

export const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 45.97 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, totalSpent: 87.45 },
];