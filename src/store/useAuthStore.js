import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aura-backend-naby.onrender.com';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('aurahealth_user')) || null,
  token: localStorage.getItem('aurahealth_auth_token') || null,
  userName: localStorage.getItem('aurahealth_user_name') || 'Invitada',
  isGuest: localStorage.getItem('aurahealth_is_guest') === 'true',
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
      localStorage.setItem('aurahealth_user_name', user.name || user.username || 'Usuario');
      set({ user, userName: user.name || user.username || 'Usuario' });
    } else {
      localStorage.removeItem('aurahealth_user');
      localStorage.removeItem('aurahealth_user_name');
      set({ user: null, userName: 'Invitada' });
    }
  },

  setCurrentCycle: (currentCycle) => set({ currentCycle }),

  enterAsGuest: () => {
    localStorage.setItem('aurahealth_is_guest', 'true');
    localStorage.removeItem('aurahealth_auth_token');
    localStorage.removeItem('aurahealth_user');
    localStorage.removeItem('aurahealth_user_name');
    set({ token: null, user: null, userName: 'Invitada', isGuest: true });
  },

  register: async (username) => {
    set({ loading: true, error: null });
    try {
      // Register with the existing backend: name + auto-generated email + password = username
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: username.trim(),
        email: `aura_${username.trim().toLowerCase()}@aura.local`,
        password: username.trim(),
      });

      // Auto-login with same credentials
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        username: username.trim(),
        password: username.trim(),
      });
      const { access_token, user } = loginRes.data;

      localStorage.setItem('aurahealth_auth_token', access_token);
      localStorage.setItem('aurahealth_user_name', username.trim());
      localStorage.removeItem('aurahealth_is_guest');
      if (user) {
        localStorage.setItem('aurahealth_user', JSON.stringify(user));
      }

      set({
        token: access_token,
        user: user || { name: username.trim() },
        userName: username.trim(),
        isGuest: false,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const data = err.response?.data;
      const errMsg = data?.message || 'Error al registrarse';
      if (data?.statusCode === 409 || data?.message?.includes('already exists') || data?.message?.includes('duplicate')) {
        set({ error: 'Este código ya está en uso. Elige otro.', loading: false });
        return { success: false, error: 'Este código ya está en uso. Elige otro.' };
      }
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  login: async (username) => {
    set({ loading: true, error: null });
    try {
      // Login with the existing backend: username field + password = username
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: username.trim(),
        password: username.trim(),
      });
      const { access_token, user } = res.data;

      localStorage.setItem('aurahealth_auth_token', access_token);
      localStorage.setItem('aurahealth_user_name', user?.name || username.trim());
      localStorage.removeItem('aurahealth_is_guest');
      if (user) {
        localStorage.setItem('aurahealth_user', JSON.stringify(user));
      }

      set({
        token: access_token,
        user: user || { name: username.trim() },
        userName: user?.name || username.trim(),
        isGuest: false,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Código incorrecto. Verifica e intenta de nuevo.';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('aurahealth_auth_token');
    localStorage.removeItem('aurahealth_user_name');
    localStorage.removeItem('aurahealth_user');
    localStorage.removeItem('aurahealth_is_guest');
    set({ token: null, user: null, userName: 'Invitada', currentCycle: null, isGuest: false });
  },
}));