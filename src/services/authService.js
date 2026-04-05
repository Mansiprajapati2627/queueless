import api from './api';

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};