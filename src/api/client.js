import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aura-backend-naby.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: añadir Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aurahealth_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: manejar 401 y cold start
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Si hay error de red o timeout o códigos de servidor durmiendo (Render cold start)
    if (!error.response || error.code === 'ECONNABORTED' || [502, 503, 504].includes(status)) {
      // Disparar un evento global para que la interfaz lo muestre de forma premium
      const event = new CustomEvent('aura-cold-start', {
        detail: { message: 'Luna está despertando... espera un momento 🌙' }
      });
      window.dispatchEvent(event);
    }
    
    // Si la respuesta es 401 (no autorizado)
    if (status === 401) {
      localStorage.removeItem('aurahealth_auth_token');
      localStorage.removeItem('aurahealth_user_name');
      localStorage.removeItem('aurahealth_user');
      
      // Disparar evento para redirigir a login
      const event = new CustomEvent('aura-unauthorized');
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default api;
