import api from './api';

// User-facing: only available items
export const fetchMenu = async () => {
  const response = await api.get('/menu/');
  return response.data;
};

// FIX #3: Admin-facing: ALL items including out-of-stock
export const fetchAllMenu = async () => {
  const response = await api.get('/menu/admin/all');
  return response.data;
};

export const fetchCategories = async () => {
  const menu = await fetchMenu();
  return [...new Set(menu.map(item => item.category))];
};

export const createMenuItem = async (itemData) => {
  const response = await api.post('/menu/', itemData);
  return response.data;
};

export const updateMenuItem = async (id, itemData) => {
  const response = await api.put(`/menu/${id}`, itemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  await api.delete(`/menu/${id}`);
};