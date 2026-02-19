import { useState, useEffect } from 'react';
import { menuService } from '../services/menuService';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = () => {
    const items = menuService.getMenuItems();
    setMenuItems(items);
    setCategories(['all', ...new Set(items.map(item => item.category))]);
    setLoading(false);
  };

  const addItem = (itemData) => {
    const newItem = menuService.addMenuItem(itemData);
    setMenuItems(prev => [...prev, newItem]);
    updateCategories();
    return newItem;
  };

  const updateItem = (id, updates) => {
    const updated = menuService.updateMenuItem(id, updates);
    setMenuItems(updated);
    updateCategories();
  };

  const deleteItem = (id) => {
    const filtered = menuService.deleteMenuItem(id);
    setMenuItems(filtered);
    updateCategories();
  };

  const updateCategories = () => {
    setCategories(['all', ...new Set(menuItems.map(item => item.category))]);
  };

  const getItemsByCategory = (category) => {
    if (category === 'all') return menuItems;
    return menuItems.filter(item => item.category === category);
  };

  const getItemById = (id) => {
    return menuItems.find(item => item.id === id);
  };

  return {
    menuItems,
    categories,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getItemById,
    refreshMenu: loadMenu
  };
};