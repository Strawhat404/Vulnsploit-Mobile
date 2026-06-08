import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string, username?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  isAuthenticated: false,

  setTokens: (access, refresh, username) =>
    set({
      accessToken: access,
      refreshToken: refresh,
      username: username ?? null,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      isAuthenticated: false,
    }),
}));
