import React, { useState, useEffect } from 'react';
import { dummyMenu } from '../../utils/dummyData';
import { formatCurrency } from '../../utils/helpers';
import { Search, Edit, Trash2, Plus, X, Save, AlertCircle } from 'lucide-react';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'
  });

  // Load from localStorage or dummy data
  useEffect(() => {
    const saved = localStorage.getItem('adminMenu');
    if (saved) {
      setMenuItems(JSON.parse(saved));
    } else {
      // Add inStock property to dummy items
      const initial = dummyMenu.map(item => ({ ...item, inStock: true }));
      setMenuItems(initial);
      localStorage.setItem('adminMenu', JSON.stringify(initial));
    }
  }, []);

  // Filter items when search or category changes
  useEffect(() => {
    let filtered = menuItems;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, menuItems]);

  // Save to localStorage whenever menu changes
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('adminMenu', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  const categories = ['all', ...new Set(menuItems.map(i => i.category))];

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSave = () => {
    setMenuItems(prev =>
      prev.map(item => item.id === editingItem.id ? editingItem : item)
    );
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleStock = (id) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      alert('Please fill at least name and price');
      return;
    }
    const newId = Math.max(...menuItems.map(i => i.id)) + 1;
    const itemToAdd = {
      ...newItem,
      id: newId,
      price: parseFloat(newItem.price),
      inStock: true,
    };
    setMenuItems(prev => [...prev, itemToAdd]);
    setShowAddForm(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'
    });
  };

  return (
    <div className="admin-menu">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button className="add-item-btn" onClick={() => setShowAddForm(true)}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Menu Item</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g., Chicken Burger"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Brief description"
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Snacks">Snacks</option>
                  <option value="Meals">Meals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Item</h3>
              <button className="close-btn" onClick={() => setEditingItem(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editingItem.description}
                  onChange={handleEditChange}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={editingItem.price}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={editingItem.category} onChange={handleEditChange}>
                  <option value="Snacks">Snacks</option>
                  <option value="Meals">Meals</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editingItem.image}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={editingItem.inStock}
                    onChange={handleEditChange}
                  />
                  In Stock
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setEditingItem(null)}>Cancel</button>
              <button className="save-btn" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="menu-items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className={`menu-item-card ${!item.inStock ? 'out-of-stock' : ''}`}>
            <div className="item-image">
              <img src={item.image} alt={item.name} />
              {!item.inStock && <span className="stock-badge">Out of Stock</span>}
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-meta">
                <span className="item-price">{formatCurrency(item.price)}</span>
                <span className="item-category">{item.category}</span>
              </div>
              <div className="item-actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="stock-btn" onClick={() => handleToggleStock(item.id)}>
                  {item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;