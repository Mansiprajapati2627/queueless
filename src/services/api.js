import axios from 'axios';
 
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
 
const api = axios.create({
  baseURL: API_BASE_URL,
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
 
    // FIX: FastAPI routers with redirect_slashes=False won't redirect /menu -> /menu/
    // But as a safety net, ensure collection endpoints always have trailing slash.
    // This prevents 307 redirects that CORS blocks entirely.
    const collectionPaths = ['/menu', '/orders', '/payments', '/users'];
    if (collectionPaths.some(p => config.url === p)) {
      config.url = config.url + '/';
    }
 
    return config;
  },
  (error) => Promise.reject(error)
);
 
export default api;
 