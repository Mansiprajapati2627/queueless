// List of your local images
const localImages = {
  Snacks: [
    '/assets/test.jpg',
    '/assets/springrolll.jpg',
    '/assets/samosa.jpg',
    '/assets/nachos.jpg',
    '/assets/frenchfries.jpg',
  ],
  Meals: [
    '/public/assets/burger.jpg',
    '/assets/pizza.jpg',  // pizza
    '/assets/burger.jpg',
    '/assets/piazza.jpg',
  ],
  Drinks: [
    '/assets/frenchfries.jpg', // placeholder – replace with drink images later
    '/assets/nachos.jpg',
  ],
  Desserts: [
    '/assets/samosa.jpg',
    '/assets/springroll.jpg',
  ]
};

// Helper to get an image for a category, cycling through available ones
const getImageForCategory = (category, index) => {
  const images = localImages[category] || localImages['Snacks'];
  return images[index % images.length];
};

// Helper to generate random INR price within a range
const randomPrice = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

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
    price: randomPrice(50, 250),      // ₹50–₹250
    description: `Delicious ${name.toLowerCase()} made fresh.`,
    image: getImageForCategory('Snacks', index)
  })),
  ...meals.map((name, index) => ({
    id: 100 + index + 1,
    name,
    category: 'Meals',
    price: randomPrice(150, 600),      // ₹150–₹600
    description: `Hearty ${name.toLowerCase()} to satisfy your hunger.`,
    image: getImageForCategory('Meals', index)
  })),
  ...drinks.map((name, index) => ({
    id: 200 + index + 1,
    name,
    category: 'Drinks',
    price: randomPrice(30, 180),       // ₹30–₹180
    description: `Refreshing ${name.toLowerCase()} to quench your thirst.`,
    image: getImageForCategory('Drinks', index)
  })),
  ...desserts.map((name, index) => ({
    id: 300 + index + 1,
    name,
    category: 'Desserts',
    price: randomPrice(80, 300),       // ₹80–₹300
    description: `Sweet ${name.toLowerCase()} to end your meal perfectly.`,
    image: getImageForCategory('Desserts', index)
  }))
];

// Orders with status history
const now = new Date();
export const dummyOrders = [
  { 
    id: 'ORD001', 
    table: 5, 
    items: [{ name: 'Veg Spring Rolls', quantity: 2, price: 99 }], 
    total: 198, 
    status: 'pending', 
    createdAt: new Date(now.getTime() - 15*60000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(now.getTime() - 15*60000).toISOString(), note: 'Order placed' }
    ]
  },
  { 
    id: 'ORD002', 
    table: 12, 
    items: [{ name: 'Margherita Pizza', quantity: 1, price: 299 }], 
    total: 299, 
    status: 'preparing', 
    createdAt: new Date(now.getTime() - 30*60000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(now.getTime() - 30*60000).toISOString(), note: 'Order placed' },
      { status: 'accepted', timestamp: new Date(now.getTime() - 25*60000).toISOString(), note: 'Order accepted' },
      { status: 'preparing', timestamp: new Date(now.getTime() - 20*60000).toISOString(), note: 'Preparing your food' }
    ]
  },
  { 
    id: 'ORD003', 
    table: 3, 
    items: [{ name: 'Chicken Burger', quantity: 2, price: 199 }], 
    total: 398, 
    status: 'ready', 
    createdAt: new Date(now.getTime() - 60*60000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(now.getTime() - 60*60000).toISOString(), note: 'Order placed' },
      { status: 'accepted', timestamp: new Date(now.getTime() - 55*60000).toISOString(), note: 'Order accepted' },
      { status: 'preparing', timestamp: new Date(now.getTime() - 45*60000).toISOString(), note: 'Preparing your food' },
      { status: 'ready', timestamp: new Date(now.getTime() - 10*60000).toISOString(), note: 'Ready for pickup' }
    ]
  }
];

export const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 895 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, totalSpent: 1850 },
];