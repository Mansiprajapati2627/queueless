import React, { useState, useEffect } from 'react';

// Enhanced Menu data with more variety
const menuItems = [
  {
    id: 1,
    name: "Tandoori Paneer Tikka",
    description: "Cottage cheese cubes marinated in yogurt and spices, grilled in clay oven",
    price: 320,
    category: "veg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    rating: 4.8,
    spicy: "Mild",
    prepTime: "20 min"
  },
  {
    id: 2,
    name: "Hyderabadi Chicken Biryani",
    description: "Fragrant basmati rice cooked with tender chicken pieces and secret spices",
    price: 380,
    category: "nonveg",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=400&h=300&fit=crop",
    rating: 4.9,
    spicy: "Medium",
    prepTime: "25 min"
  },
  {
    id: 3,
    name: "Gourmet Veg Burger",
    description: "House-made patty with fresh vegetables, special sauce, and cheese",
    price: 220,
    category: "veg",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.5,
    spicy: "Mild",
    prepTime: "15 min"
  },
  {
    id: 4,
    name: "BBQ Chicken Burger",
    description: "Juicy chicken patty with BBQ glaze, crispy lettuce, and cheese",
    price: 260,
    category: "nonveg",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.7,
    spicy: "Medium",
    prepTime: "18 min"
  },
  {
    id: 5,
    name: "Artisan Cold Coffee",
    description: "Premium arabica coffee blended with ice cream and chocolate syrup",
    price: 180,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    rating: 4.6,
    spicy: "None",
    prepTime: "8 min"
  },
  {
    id: 6,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 220,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&h=300&fit=crop",
    rating: 4.8,
    spicy: "None",
    prepTime: "12 min"
  },
  {
    id: 7,
    name: "Margherita Pizza",
    description: "Wood-fired pizza with fresh mozzarella, tomatoes, and basil",
    price: 320,
    category: "veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    rating: 4.7,
    spicy: "Mild",
    prepTime: "22 min"
  },
  {
    id: 8,
    name: "Fresh Lemonade",
    description: "Freshly squeezed lemon juice with mint leaves and honey",
    price: 120,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1621264968373-430b60e8af3b?w=400&h=300&fit=crop",
    rating: 4.4,
    spicy: "None",
    prepTime: "5 min"
  },
  {
    id: 9,
    name: "Butter Chicken",
    description: "Tender chicken pieces in rich tomato and butter gravy",
    price: 350,
    category: "nonveg",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    rating: 4.9,
    spicy: "Medium",
    prepTime: "25 min"
  },
  {
    id: 10,
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in creamy tomato and butter gravy",
    price: 280,
    category: "veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    rating: 4.7,
    spicy: "Mild",
    prepTime: "20 min"
  },
  {
    id: 11,
    name: "Mango Lassi",
    description: "Refreshing yogurt drink with mango pulp and saffron",
    price: 140,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1621264968373-430b60e8af3b?w=400&h=300&fit=crop",
    rating: 4.5,
    spicy: "None",
    prepTime: "7 min"
  },
  {
    id: 12,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers",
    price: 240,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&h=300&fit=crop",
    rating: 4.8,
    spicy: "None",
    prepTime: "15 min"
  }
];

const categories = [
  { id: 'all', label: 'All', icon: 'fas fa-bars' },
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

  const getRatingStars = (rating) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
        <i className="fas fa-star" style={{ color: 'var(--warning)', fontSize: '0.75rem' }}></i>
        <span style={{ fontSize: '0.75rem', fontWeight: '600', marginLeft: '4px' }}>{rating}</span>
      </div>
    );
  };

  const getSpicyLevel = (level) => {
    const colors = {
      'Mild': 'var(--success)',
      'Medium': 'var(--warning)',
      'Spicy': 'var(--danger)',
      'None': 'var(--gray-500)'
    };
    
    return (
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        fontSize: '0.75rem',
        color: colors[level],
        marginTop: '4px'
      }}>
        <i className="fas fa-pepper-hot"></i>
        <span>{level}</span>
      </div>
    );
  };

  return (
    <main className="main-content">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search dishes, ingredients..."
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

      {/* Menu Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 10px'
      }}>
        <h2 className="section-title">Our Menu</h2>
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'var(--gray-600)',
          background: 'var(--gray-100)',
          padding: '6px 12px',
          borderRadius: '20px'
        }}>
          {filteredItems.length} items
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
                       item.category === 'beverages' ? '🥤 Drink' :
                       '🍰 Dessert'}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="fas fa-clock"></i>
                      {item.prepTime}
                    </div>
                  </div>
                  
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div style={{ flex: 1 }}>
                        <h3 className="item-name">{item.name}</h3>
                        {getRatingStars(item.rating)}
                        {getSpicyLevel(item.spicy)}
                      </div>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    
                    <p className="item-description">{item.description}</p>
                    
                    <div className="menu-item-footer">
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '8px 20px' }}
                        >
                          <i className="fas fa-plus"></i>
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="qty-btn"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="qty-value">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="qty-btn"
                          >
                            <i className="fas fa-plus"></i>
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
            <i className="fas fa-search empty-state-icon"></i>
            <h3>No dishes found</h3>
            <p>Try adjusting your search or filter</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Cart Summary */}
      {totalItems > 0 && (
        <div className="quick-cart-summary">
          <div className="quick-cart-content">
            <div className="cart-info">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '0.875rem'
              }}>
                <i className="fas fa-shopping-cart" style={{ color: 'var(--primary)' }}></i>
                <span>{totalItems} items</span>
              </div>
              <div style={{ 
                fontSize: '1.125rem', 
                fontWeight: '700',
                color: 'var(--primary)'
              }}>
                ₹{totalAmount}
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/cart'}
              className="btn btn-primary"
            >
              View Cart
              <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default MenuPage;