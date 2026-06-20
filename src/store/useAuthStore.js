import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aura-backend-naby.onrender.com';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('aurahealth_user')) || null,
  token: localStorage.getItem('aurahealth_auth_token') || null,
  userName: localStorage.getItem('aurahealth_user_name') || 'Usuario',
  currentCycle: null,
  loading: false,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('aurahealth_auth_token', token);
    } else {
      localStorage.removeItem('aurahealth_auth_token');
    }
    set({ token });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('aurahealth_user', JSON.stringify(user));
      localStorage.setItem('aurahealth_user_name', user.name || 'Usuario');
      set({ user, userName: user.name || 'Usuario' });
    } else {
      localStorage.removeItem('aurahealth_user');
      localStorage.removeItem('aurahealth_user_name');
      set({ user: null, userName: 'Usuario' });
    }
  },

  setCurrentCycle: (currentCycle) => set({ currentCycle }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: email.trim(),
        password,
      });
      const { access_token, user } = res.data;
      
      localStorage.setItem('aurahealth_auth_token', access_token);
      localStorage.setItem('aurahealth_user_name', user?.name || 'Usuario');
      if (user) {
        localStorage.setItem('aurahealth_user', JSON.stringify(user));
      }

      set({
        token: access_token,
        user: user || { name: 'Usuario' },
        userName: user?.name || 'Usuario',
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al iniciar sesión';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      // Registrar usuario
      await axios.post(`${API_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Login automático
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        username: email.trim(),
        password,
      });

      const { access_token, user } = loginRes.data;
      
      localStorage.setItem('aurahealth_auth_token', access_token);
      localStorage.setItem('aurahealth_user_name', name.trim());
      if (user) {
        localStorage.setItem('aurahealth_user', JSON.stringify(user));
      }

      set({
        token: access_token,
        user: user || { name: name.trim() },
        userName: name.trim(),
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al registrarse';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('aurahealth_auth_token');
    localStorage.removeItem('aurahealth_user_name');
    localStorage.removeItem('aurahealth_user');
    set({ token: null, user: null, userName: 'Usuario', currentCycle: null });
  },
}));
