import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MenuPage = ({ cart, addToCart, updateQuantity, user, tableNumber }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchTerm, menuItems]);

  const loadMenuItems = () => {
    const saved = localStorage.getItem('queueless_menu_items');
    if (saved) {
      const items = JSON.parse(saved);
      setMenuItems(items);
      const uniqueCategories = ['all', ...new Set(items.map(item => item.category))];
      setCategories(uniqueCategories);
    } else {
      // Sample data
      const sample = [
        { id: 1, name: 'Paneer Tikka', price: 280, category: 'veg', description: 'Grilled cottage cheese with spices', image: '', availability: 'available' },
        { id: 2, name: 'Chicken Biryani', price: 350, category: 'nonveg', description: 'Fragrant rice with spicy chicken', image: '', availability: 'available' },
        { id: 3, name: 'Cold Coffee', price: 120, category: 'beverages', description: 'Iced coffee with cream', image: '', availability: 'available' },
        { id: 4, name: 'Chocolate Brownie', price: 150, category: 'desserts', description: 'Warm chocolate brownie', image: '', availability: 'available' },
        { id: 5, name: 'Veg Spring Rolls', price: 180, category: 'appetizers', description: 'Crispy vegetable rolls', image: '', availability: 'available' },
        { id: 6, name: 'Butter Chicken', price: 380, category: 'nonveg', description: 'Tender chicken in rich gravy', image: '', availability: 'available' },
      ];
      setMenuItems(sample);
      setCategories(['all', 'veg', 'nonveg', 'appetizers', 'beverages', 'desserts']);
      localStorage.setItem('queueless_menu_items', JSON.stringify(sample));
    }
  };

  const filterItems = () => {
    let filtered = menuItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    paddingBottom: '80px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const searchStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px'
  };

  const categoriesStyle = {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '10px 0',
    marginBottom: '30px'
  };

  const categoryChipStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? '#667eea' : '#edf2f7',
    color: isActive ? 'white' : '#4a5568',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '400'
  });

  const menuGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  };

  const menuItemStyle = {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const itemImageStyle = {
    height: '200px',
    background: 'linear-gradient(45deg, #e2e8f0 25%, #edf2f7 50%, #e2e8f0 75%)',
    backgroundSize: '200% 200%',
    animation: 'shimmer 1.5s infinite',
    position: 'relative'
  };

  const badgeStyle = (type) => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    background: type === 'veg' ? '#c6f6d5' : '#fed7d7',
    color: type === 'veg' ? '#22543d' : '#742a2a'
  });

  const itemDetailsStyle = {
    padding: '15px'
  };

  const itemFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  };

  const priceStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#667eea'
  };

  const quantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const quantityButtonStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Our Menu</h1>
        {tableNumber && (
          <span style={{ background: '#e2e8f0', padding: '8px 16px', borderRadius: '50px' }}>
            <Icon name="table" /> Table {tableNumber}
          </span>
        )}
      </div>

      <input
        type="text"
        placeholder="Search dishes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      <div style={categoriesStyle}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={categoryChipStyle(selectedCategory === category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div style={menuGridStyle}>
        {filteredItems.map(item => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <div key={item.id} style={menuItemStyle}>
              <div style={itemImageStyle}>
                <span style={badgeStyle(item.category)}>
                  {item.category === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </span>
              </div>
              <div style={itemDetailsStyle}>
                <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>{item.description}</p>
                <div style={itemFooterStyle}>
                  <span style={priceStyle}>₹{item.price}</span>
                  {quantity === 0 ? (
                    <Button
                      size="sm"
                      icon="plus"
                      onClick={() => addToCart(item, 1)}
                      disabled={!user || !tableNumber}
                    >
                      Add
                    </Button>
                  ) : (
                    <div style={quantityControlsStyle}>
                      <button
                        style={quantityButtonStyle}
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Icon name="minus" size={12} />
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        style={quantityButtonStyle}
                        onClick={() => addToCart(item, 1)}
                      >
                        <Icon name="plus" size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icon name="menu" size={48} />
          <p style={{ color: '#666', marginTop: '10px' }}>No items found</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;