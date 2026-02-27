// Helper to get a consistent Unsplash image for each category
const getImageForCategory = (category, index) => {
  const images = {
    Snacks: [
      'https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3ByaW5nJTIwcm9sbHN8ZW58MHx8MHx8fDA%3D', // spring rolls
      'https://images.unsplash.com/photo-1619604107557-b5321217aee7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmFjaG9zfGVufDB8fDB8fHww', // nachos
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJpZXN8ZW58MHx8MHx8fDA%3D', // fries
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300', // wings
    ],
    Meals: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGl6emF8ZW58MHx8MHx8fDA%3D', // pizza
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyfGVufDB8fDB8fHww', // burger
      'https://images.unsplash.com/photo-1567575990843-105a1c70d76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJvd2x8ZW58MHx8MHx8fDA%3D', // bowl
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGF8ZW58MHx8MHx8fDA%3D', // pasta
    ],
    Drinks: [
      'https://images.unsplash.com/photo-1593443320739-77f74939d0da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGF0dGV8ZW58MHx8MHx8fDA%3D', // latte
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8anVpY2V8ZW58MHx8MHx8fDA%3D', // juice
      'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtb290aGllfGVufDB8fDB8fHww', // smoothie
      'https://plus.unsplash.com/premium_photo-1671647122910-3fa8ab4990cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29ja3RhaWx8ZW58MHx8MHx8fDA%3D', // mocktail
    ],
    Desserts: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300', // brownie
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300', // ice cream
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300', // cheesecake
      'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=300', // pancakes
    ]
  };
  const categoryImages = images[category] || images['Snacks'];
  return categoryImages[index % categoryImages.length];
};

// Generate 25 items per category with realistic images
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
    price: +(Math.random() * 8 + 4).toFixed(2),
    description: `Delicious ${name.toLowerCase()} made fresh.`,
    image: getImageForCategory('Snacks', index)
  })),
  ...meals.map((name, index) => ({
    id: 100 + index + 1,
    name,
    category: 'Meals',
    price: +(Math.random() * 12 + 8).toFixed(2),
    description: `Hearty ${name.toLowerCase()} to satisfy your hunger.`,
    image: getImageForCategory('Meals', index)
  })),
  ...drinks.map((name, index) => ({
    id: 200 + index + 1,
    name,
    category: 'Drinks',
    price: +(Math.random() * 5 + 2).toFixed(2),
    description: `Refreshing ${name.toLowerCase()} to quench your thirst.`,
    image: getImageForCategory('Drinks', index)
  })),
  ...desserts.map((name, index) => ({
    id: 300 + index + 1,
    name,
    category: 'Desserts',
    price: +(Math.random() * 7 + 4).toFixed(2),
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
    items: [{ name: 'Veg Spring Rolls', quantity: 2, price: 5.99 }], 
    total: 11.98, 
    status: 'pending', 
    createdAt: new Date(now.getTime() - 15*60000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(now.getTime() - 15*60000).toISOString(), note: 'Order placed' }
    ]
  },
  { 
    id: 'ORD002', 
    table: 12, 
    items: [{ name: 'Margherita Pizza', quantity: 1, price: 12.99 }], 
    total: 12.99, 
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
    items: [{ name: 'Chicken Burger', quantity: 2, price: 10.0 }], 
    total: 20.00, 
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
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 3, totalSpent: 45.97 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5, totalSpent: 87.45 },
];