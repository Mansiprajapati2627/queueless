import axios from 'axios';

// Mock axios instance – in real app baseURL would point to server
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

// Simulate delay for mock responses
api.interceptors.response.use(async (response) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return response;
});

export default api;