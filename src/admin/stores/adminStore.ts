import { create } from 'zustand';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface AdminStore {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  user: null,
  token: localStorage.getItem('admin_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: (user, token) => {
    localStorage.setItem('admin_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
