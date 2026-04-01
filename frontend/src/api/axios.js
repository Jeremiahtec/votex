// Axios instance with base URL and JWT interceptor
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('votex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error interceptor — redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('votex_token');
      localStorage.removeItem('votex_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
