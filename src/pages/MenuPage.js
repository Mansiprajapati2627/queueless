import React, { useState, useEffect } from 'react';

// Menu data
const menuItems = [
  {
    id: 1,
    name: "Paneer Tikka",
    description: "Grilled cottage cheese cubes with spices",
    price: 280,
    category: "veg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Chicken Biryani",
    description: "Fragrant rice with spicy chicken",
    price: 350,
    category: "nonveg",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Veg Burger",
    description: "Fresh vegetables with special sauce",
    price: 180,
    category: "veg",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Chicken Burger",
    description: "Juicy chicken patty with lettuce",
    price: 220,
    category: "nonveg",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Cold Coffee",
    description: "Iced coffee with cream",
    price: 120,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with ice cream",
    price: 150,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Pizza Margherita",
    description: "Classic pizza with tomato and cheese",
    price: 300,
    category: "veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Lemonade",
    description: "Fresh lemon juice with mint",
    price: 80,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1621264968373-430b60e8af3b?w=400&h=300&fit=crop"
  }
];

const categories = [
  { id: 'all', label: 'All', icon: 'fas fa-filter' },
  { id: 'veg', label: 'Vegetarian', icon: 'fas fa-leaf' },
  { id: 'nonveg', label: 'Non-Veg', icon: 'fas fa-drumstick-bite' },
  { id: 'beverages', label: 'Beverages', icon: 'fas fa-wine-glass-alt' },
  { id: 'desserts', label: 'Desserts', icon: 'fas fa-ice-cream' }
];

const MenuPage = ({ cart, addToCart, updateQuantity, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState(menuItems);

  useEffect(() => {
    let filtered = menuItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory]);

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <main className="main-content">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-scroller">
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-container">
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item.id);
              
              return (
                <div key={item.id} className="menu-item-card">
                  <div className="menu-item-image">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className={`item-category ${item.category}`}>
                      {item.category === 'veg' ? '🥬 Veg' : 
                       item.category === 'nonveg' ? '🍗 Non-Veg' : 
                       item.category.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <h3 className="item-name">{item.name}</h3>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    
                    <p className="item-description">{item.description}</p>
                    
                    <div className="menu-item-footer">
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-primary btn-sm"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span className="qty-value">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-filter empty-state-icon"></i>
            <h3>No items found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Quick Cart Summary */}
      {totalItems > 0 && (
        <div className="quick-cart-summary">
          <div className="quick-cart-content">
            <div className="cart-info">
              <span>{totalItems} items</span>
              <span className="cart-total">₹{totalAmount}</span>
            </div>
            <button
              onClick={() => window.location.href = '/cart'}
              className="btn btn-primary"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default MenuPage;