import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'veg',
    description: '',
    availability: 'available'
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchTerm, menuItems]);

  const loadMenuItems = () => {
    const saved = localStorage.getItem('queueless_menu_items');
    if (saved) {
      setMenuItems(JSON.parse(saved));
    } else {
      const sample = [
        { id: 1, name: 'Paneer Tikka', price: 280, category: 'veg', description: 'Grilled cottage cheese', availability: 'available' },
        { id: 2, name: 'Chicken Biryani', price: 350, category: 'nonveg', description: 'Fragrant rice with chicken', availability: 'available' },
        { id: 3, name: 'Cold Coffee', price: 120, category: 'beverages', description: 'Iced coffee', availability: 'available' },
      ];
      setMenuItems(sample);
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
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = menuItems.map(item => 
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      );
      setMenuItems(updated);
      localStorage.setItem('queueless_menu_items', JSON.stringify(updated));
    } else {
      const newItem = { ...formData, id: Date.now() };
      const updated = [...menuItems, newItem];
      setMenuItems(updated);
      localStorage.setItem('queueless_menu_items', JSON.stringify(updated));
    }
    
    closeModal();
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Delete this item?')) {
      const updated = menuItems.filter(item => item.id !== itemId);
      setMenuItems(updated);
      localStorage.setItem('queueless_menu_items', JSON.stringify(updated));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: 'veg',
      description: '',
      availability: 'available'
    });
  };

  const categories = ['all', 'veg', 'nonveg', 'beverages', 'desserts'];

  const containerStyle = {
    padding: '20px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const searchStyle = {
    flex: 1,
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    minWidth: '250px'
  };

  const categoriesStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  };

  const categoryChipStyle = (isActive) => ({
    padding: '8px 16px',
    background: isActive ? '#667eea' : '#edf2f7',
    color: isActive ? 'white' : '#4a5568',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  };

  const itemCardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const itemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const categoryBadgeStyle = (category) => ({
    padding: '4px 8px',
    background: category === 'veg' ? '#c6f6d5' : category === 'nonveg' ? '#fed7d7' : '#e2e8f0',
    color: category === 'veg' ? '#22543d' : category === 'nonveg' ? '#742a2a' : '#4a5568',
    borderRadius: '4px',
    fontSize: '12px'
  });

  const availabilityBadgeStyle = (availability) => ({
    padding: '4px 8px',
    background: availability === 'available' ? '#c6f6d5' : '#fed7d7',
    color: availability === 'available' ? '#22543d' : '#742a2a',
    borderRadius: '4px',
    fontSize: '12px'
  });

  const itemFooterStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  };

  const priceStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#667eea'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '10px'
  };

  const actionButtonStyle = {
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    background: '#f7fafc'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Menu Management</h1>
        <Button onClick={() => setShowModal(true)} icon="plus">
          Add Item
        </Button>
      </div>

      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Search menu..."
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
              {category}
            </button>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {filteredItems.map(item => (
          <div key={item.id} style={itemCardStyle}>
            <div style={itemHeaderStyle}>
              <span style={categoryBadgeStyle(item.category)}>
                {item.category}
              </span>
              <span style={availabilityBadgeStyle(item.availability)}>
                {item.availability}
              </span>
            </div>
            <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              {item.description}
            </p>
            <div style={itemFooterStyle}>
              <span style={priceStyle}>₹{item.price}</span>
              <div style={actionsStyle}>
                <button
                  style={actionButtonStyle}
                  onClick={() => {
                    setEditingItem(item);
                    setFormData(item);
                    setShowModal(true);
                  }}
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  style={actionButtonStyle}
                  onClick={() => handleDelete(item.id)}
                >
                  <Icon name="delete" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingItem ? 'Edit Item' : 'Add Item'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <Input
            label="Price (₹)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
            >
              <option value="veg">Vegetarian</option>
              <option value="nonveg">Non-Vegetarian</option>
              <option value="beverages">Beverages</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({...formData, availability: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="limited">Limited</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenu;