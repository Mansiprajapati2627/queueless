import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // or 'http://localhost:8000' – pick the one that worked in the console test
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;