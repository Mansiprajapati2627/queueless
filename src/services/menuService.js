import api from './api';

export const fetchMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const fetchCategories = async () => {
  const menu = await fetchMenu();
  const categories = [...new Set(menu.map(item => item.category))];
  return categories;
};

export const createMenuItem = async (itemData) => {
  const response = await api.post('/menu', itemData);
  return response.data;
};

export const updateMenuItem = async (id, itemData) => {
  const response = await api.put(`/menu/${id}`, itemData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  await api.delete(`/menu/${id}`);
};