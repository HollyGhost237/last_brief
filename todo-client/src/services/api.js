import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Injection automatique du token
api.interceptors.request.use((config) => {
  const auth_token = localStorage.getItem('auth_token');
  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }
  return config;
});

export default api;