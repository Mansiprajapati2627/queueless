export const menuService = {
  getMenuItems: () => {
    const items = localStorage.getItem('queueless_menu_items');
    return items ? JSON.parse(items) : [];
  },

  addMenuItem: (item) => {
    const items = menuService.getMenuItems();
    const newItem = { ...item, id: Date.now() };
    items.push(newItem);
    localStorage.setItem('queueless_menu_items', JSON.stringify(items));
    return newItem;
  },

  updateMenuItem: (id, updatedItem) => {
    const items = menuService.getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem('queueless_menu_items', JSON.stringify(items));
    }
    return items;
  },

  deleteMenuItem: (id) => {
    const items = menuService.getMenuItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('queueless_menu_items', JSON.stringify(filtered));
    return filtered;
  }
};