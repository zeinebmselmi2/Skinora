import axios from 'axios';

// VITE_API_URL pointe vers le serveur local ou vers Render après déploiement.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Intercepteur : ajoute le JWT à chaque requête si l'utilisateur est connecté.
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');

  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

export default api;
