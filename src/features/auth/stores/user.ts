import { create } from 'zustand';
import type { User } from '@/features/auth/types/auth';

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

// Helper functions for localStorage
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  setUser: (user) => {
    if (user) {
      storage.setUser(user);
    } else {
      storage.removeUser();
    }
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      storage.setToken(token);
    } else {
      storage.removeToken();
    }
    set({ token });
  },
  logout: () => {
    storage.clear();
    set({ user: null, token: null });
  },
  initializeFromStorage: () => {
    set({
      user: storage.getUser(),
      token: storage.getToken()
    });
  }
}));