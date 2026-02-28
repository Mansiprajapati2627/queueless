// Helper for INR prices
const randomPrice = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// All image paths MUST start with a forward slash /
const getImageForCategory = (category, index) => {
  const imageMap = {
    Snacks: [
      '/assets/Snacks/maggie.jpg',
      '/assets/Snacks/Masalamaggie.jpg', // fixed typo: "assests" -> "assets"
      '/assets/Snacks/cheesemaggie.jpg',
      '/assets/Snacks/steamedmomos.jpg',
      '/assets/Snacks/friedmomos.jpg',
      '/assets/Snacks/kurkuremomos.jpg',
      '/assets/Snacks/vadapav.jpg',
      '/assets/Snacks/dabeli.jpg',
      '/assets/Snacks/samosa.jpg',
      '/assets/Snacks/nachos.jpg',
      '/assets/Snacks/frenchfries.jpg',
      '/assets/Snacks/onionrings.jpg',
      '/assets/Snacks/aloofrankie.jpg',
      '/assets/Snacks/schezwanfrankie.jpg',
      '/assets/Snacks/paneerfrankie.jpg',
      '/assets/Snacks/poha.jpg',
      '/assets/Snacks/upma.jpg',
      '/assets/Snacks/dhokla.jpg',
      '/assets/Snacks/redsaucepasta.jpg',
      '/assets/Snacks/whitesaucepasta.jpg',
      '/assets/Snacks/pestopasta.jpg',
      '/assets/Snacks/miniburger.jpg',
      '/assets/Snacks/tacos.jpg',
      '/assets/Snacks/sandwich.jpg',
      '/assets/Snacks/grilledsandwich.jpg',
    ],
    Meals: [
      '/assets/Meals/Margheritapizza.jpg',
      '/assets/Meals/7cheesepizza.jpg',
      '/assets/Meals/veggiesupremepizza.jpg',
      '/assets/Meals/pepperonipizza.jpg',
      '/assets/Meals/paneertikkapizza.jpg',
      '/assets/Meals/farmhousepizza.jpg',
      '/assets/Meals/alootikkiburger.jpg',
      '/assets/Meals/periperiburger.jpg',
      '/assets/Meals/schezwanburger.jpg',
      '/assets/Meals/mexicanburger.jpg',
      '/assets/Meals/italianburger.jpg',
      '/assets/Meals/cheeseburger.jpg',
      '/assets/Meals/cholebhature.jpg',
      '/assets/Meals/pavbhaji.jpg',
      '/assets/Meals/cholekulche.jpg',
      '/assets/Meals/idlisambhar.jpg',
      '/assets/Meals/uttapam.jpg',
      '/assets/Meals/menduvada.jpg',
      '/assets/Meals/plaindosa.jpg',
      '/assets/Meals/masaladosa.jpg',
      '/assets/Meals/mysoremasaladosa.jpg',
      '/assets/Meals/cheesemasaladosa.jpg',
      '/assets/Meals/ravadosa.jpg',
      '/assets/Meals/bennedosa.jpg',
      '/assets/Meals/alooparatha.jpg',
    ],
    Beverages: [
      '/assets/Beverages/chai.jpg',
      '/assets/Beverages/masalachai.jpg',
      '/assets/Beverages/greentea.jpg',
      '/assets/Beverages/Blackcoffee.jpg',
      '/assets/Beverages/coffee.jpg',
      '/assets/Beverages/Coldcoffee.jpg',
      '/assets/Beverages/chocolateshake.jpg',
      '/assets/Beverages/strawberryshake.jpg',
      '/assets/Beverages/oreoshake.jpg',
      '/assets/Beverages/brownieshake.jpg',
      '/assets/Beverages/vanillashake.jpg',
      '/assets/Beverages/kitkatshake.jpg',
      '/assets/Beverages/limesoda.jpg',
      '/assets/Beverages/watermelonjuice.jpg',
      '/assets/Beverages/orangejuice.jpg',
      '/assets/Beverages/coke.jpg',
      '/assets/Beverages/dietcoke.jpg',
      '/assets/Beverages/sprite.jpg',
      '/assets/Beverages/fanta.jpg',
      '/assets/Beverages/lemonade.jpg',
      '/assets/Beverages/buttermilk.jpg',
      '/assets/Beverages/lassi.jpg',
      '/assets/Beverages/mangolassi.jpg',
      '/assets/Beverages/roselassi.jpg',
      '/assets/Beverages/hotchocolate.mp4',
      '/assets/Beverages/water.jpg',
    ],
    Desserts: [
      '/assets/Desserts/chocolatebrownie.jpg',
      '/assets/Desserts/cheesecake.jpg',
      '/assets/Desserts/tiramisu.jpg',
      '/assets/Desserts/pudding.jpg',
      '/assets/Desserts/kulfi.jpg',
      '/assets/Desserts/donut.jpg',
      '/assets/Desserts/vanillaicecream.jpg',
      '/assets/Desserts/chocolateicecream.jpg',
      '/assets/Desserts/chocobrownieicecream.jpg',
      '/assets/Desserts/oreocrunchwaffle.jpg',
      '/assets/Desserts/belgianwaffle.jpg',
      '/assets/Desserts/chocoblastwaffle.jpg',
      '/assets/Desserts/pancakes.jpg',
      '/assets/Desserts/cupcake.jpg',
      '/assets/Desserts/browniesundae.jpg',
      '/assets/Desserts/chocolatepastry.jpg',
      '/assets/Desserts/chocolatefudgepastry.jpg',
      '/assets/Desserts/chocochippastry.jpg',
    ]
  };
  
  const images = imageMap[category] || imageMap['Snacks'];
  return images[index % images.length];
};

// ----- 25 items per category -----
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

const beverages = [
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
  'Oreo Crunch Waffle', 'Belgian Waffles', 'Choco Blast Waffle',
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
  ...beverages.map((name, index) => ({    // FIXED: changed 'drinks' to 'beverages'
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