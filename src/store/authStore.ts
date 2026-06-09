import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setTokens: (access: string, refresh: string, username?: string) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  isAuthenticated: false,
  isHydrated: false,

  setTokens: (access, refresh, username) =>
    set({
      accessToken: access,
      refreshToken: refresh,
      username: username ?? null,
      isAuthenticated: true,
    }),

  setHydrated: (hydrated) => set({ isHydrated: hydrated }),

  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      isAuthenticated: false,
    }),
}));
