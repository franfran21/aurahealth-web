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
      const res = await axios.post(`${API_URL}/auth/register`, {
        username: username.trim(),
      });
      const { access_token, user } = res.data;

      if (res.data.statusCode === 409) {
        set({ error: res.data.message, loading: false });
        return { success: false, error: res.data.message };
      }

      localStorage.setItem('aurahealth_auth_token', access_token);
      localStorage.setItem('aurahealth_user_name', username.trim());
      localStorage.removeItem('aurahealth_is_guest');
      if (user) {
        localStorage.setItem('aurahealth_user', JSON.stringify(user));
      }

      set({
        token: access_token,
        user: user || { name: username.trim(), username: username.trim() },
        userName: username.trim(),
        isGuest: false,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const data = err.response?.data;
      const errMsg = data?.message || 'Error al registrarse';
      if (data?.statusCode === 409) {
        set({ error: data.message, loading: false });
        return { success: false, error: data.message };
      }
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  login: async (username) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: username.trim(),
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
        user: user || { name: username.trim(), username: username.trim() },
        userName: user?.name || username.trim(),
        isGuest: false,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error al iniciar sesión';
      if (err.response?.data?.statusCode === 409) {
        set({ error: 'Código incorrecto. Intenta de nuevo.', loading: false });
        return { success: false, error: 'Código incorrecto. Intenta de nuevo.' };
      }
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