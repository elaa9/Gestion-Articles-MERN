import axios from 'axios';

// 1. Instance Axios pointant vers le serveur Express
// En production, utiliser l'URL du serveur cloud
const apiBaseUrl = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://gestion-articles-mern.onrender.com/api'
    : 'http://localhost:5000/api');

const axiosClient = axios.create({
  baseURL: apiBaseUrl
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