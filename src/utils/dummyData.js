// Helper for INR prices
const randomPrice = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// All image paths MUST start with a forward slash /
const getImageForCategory = (category, index) => {
  const imageMap = {
    Snacks: [
      '/assets/springroll.jpg',
      '/assets/vadapav.jpg',
      '/assets/onionrings.jpg',
      '/assets/frenchfries.jpg',
      '/assets/nachos.jpg',
      '/assets/samosa.jpg',
      '/assets/pakora.jpg',
      '/assets/bruschetta.jpg',
      '/assets/garlicbread.jpg',
      '/assets/dabeli.jpg',
    ],
    Meals: [
      '/assets/burger.jpg',
      '/assets/pizza.jpg',
      '/assets/burger.jpg',
      '/assets/pizza.jpg',
    ],
    Beverages: [
      '/assets/oreo shake.jpg', // placeholder
      '/assets/coke.jpg',
      '/assets/frape.jpg',
      '/assets/coffee.jpg',
      '/assets/choco shake.jpg',
    ],
    Desserts: [
      '/assets/vanilla icecream.jpg',
      '/assets/springroll.jpg',
    ]
  };
  
  const images = imageMap[category] || imageMap['Snacks'];
  return images[index % images.length];
};

// ----- 25 items per category (unchanged) -----
const snacks = [
 'Maggie','Masala Maggi','Cheese Maggi',
 'Steamed Momos','Fried Momos','Kurkure Momos',
 'Vadapav','Dabeli','Samosa',
 'Nachos','French Fries','Onion Rings',
 'Aloo Frankie','Schezwan Frankie','Paneer Frankie',
 'Poha','Upma','Dhokla',
 'Red Sauce Pasta','White Sauce Pasta','Pesto Pasta',
 'Mini Burger','Tacos','Sandwich',
 'Grilled Cheese Sandwich'
];
const meals = [
  'Margherita Pizza', '7 Cheese Pizza', 'Veggie Supreme Pizza',
  'Pepperoni Pizza', 'Paneer Tikka Pizza', 'Farmhouse Pizza',
  'Aloo Tikki Burger', 'Peri Peri Burger', 'Schezwan Burger',
  'Mexican Burger', 'Italian Burger', 'Cheese Burger', 
  'Chole Bhature','Pav Bhaji','Chole Kulche',
  'idli Sambhar','Uttapam','Mendu Vada',
  'Plain Dosa','Masala Dosa','Mysore Masala Dosa',
  'Cheese Masala Dosa','Rava Dosa','Benne Dosa',
  'Aloo paratha'

];
const Beverages = [
  'Chai', 'Masala Chai', 'Green Tea', 
  'Black Coffee','Coffee','Cold Coffee',
  'Chocolate Shake','Strawberry Shake','Oreo Shake',
  'Brownie Shake','Vanilla Shake','Kitkat Shake',
  'Fresh Lime Soda', 'Watermelon Juice', 'Orange Juice',
  'Coke', 'Diet Coke', 'Sprite',
  'Fanta','Lemonade','Buttermilk',
  'Lassi', 'Mango Lassi','Rose Lassi',
  'Hot Chocolate', 'Mineral Water',
  
];
const desserts = [
  'Chocolate Brownie', 'Cheesecake', 'Tiramisu', 
  'Pudding','Kulfi','Donut',
  'Vanilla Ice Cream','Chocolate Ice Cream','Choco Brownie Ice Cream',
  'Oreo Crunch Waffle', ' Belgian Waffles', 'Choco Blast Waffle',
  'Pancakes', 'Cupcake','Brownie Sundae',
  'Chocolate Pastry','Chocolate Fudge Pastry','Choco Chip Pastry',
  
];

export const dummyMenu = [
  ...snacks.map((name, index) => ({
    id: index + 1,
    name,
    category: 'Snacks',
    price: randomPrice(50, 250),
    description: `Delicious ${name.toLowerCase()} made fresh.`,
    image: getImageForCategory('Snacks', index)
  })),
  ...meals.map((name, index) => ({
    id: 100 + index + 1,
    name,
    category: 'Meals',
    price: randomPrice(150, 600),
    description: `Hearty ${name.toLowerCase()} to satisfy your hunger.`,
    image: getImageForCategory('Meals', index)
  })),
  ...drinks.map((name, index) => ({
    id: 200 + index + 1,
    name,
    category: 'Beverages',
    price: randomPrice(30, 180),
    description: `Refreshing ${name.toLowerCase()} to quench your thirst.`,
    image: getImageForCategory('Beverages', index)
  })),
  ...desserts.map((name, index) => ({
    id: 300 + index + 1,
    name,
    category: 'Desserts',
    price: randomPrice(80, 300),
    description: `Sweet ${name.toLowerCase()} to end your meal perfectly.`,
    image: getImageForCategory('Desserts', index)
  }))
];

// Orders and customers (unchanged)
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