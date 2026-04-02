import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://queueless-le0k.onrender.com"; // fallback FIXED

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;