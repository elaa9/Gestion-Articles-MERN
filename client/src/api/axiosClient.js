import axios from 'axios';

// 1. Instance Axios pointant vers le serveur Express
// En production, utiliser l'URL du serveur cloud
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// 2. Intercepteur JWT : ajoute automatiquement le token Bearer
// à chaque requête HTTP
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;