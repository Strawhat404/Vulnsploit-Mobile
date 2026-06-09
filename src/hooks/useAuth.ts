import { useCallback } from 'react';
import { router } from 'expo-router';
import { login as loginApi, register as registerApi } from '@/api/auth';
import { parseApiError, type ApiError } from '@/api/errors';
import { clearSession, loadSession, saveSession } from '@/services/secureStorage';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const username = useAuthStore((s) => s.username);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const hydrate = useCallback(async () => {
    const session = await loadSession();
    if (session) {
      useAuthStore
        .getState()
        .setTokens(session.accessToken, session.refreshToken, session.username);
    }
    useAuthStore.getState().setHydrated(true);
  }, []);

  const login = useCallback(async (user: string, password: string): Promise<ApiError | null> => {
    try {
      const tokens = await loginApi({ username: user, password });
      useAuthStore.getState().setTokens(tokens.access, tokens.refresh, user);
      await saveSession(tokens.access, tokens.refresh, user);
      router.replace('/(tabs)');
      return null;
    } catch (err) {
      return parseApiError(err, 'Login failed. Please try again.');
    }
  }, []);

  const register = useCallback(
    async (
      user: string,
      password: string,
      password2: string
    ): Promise<{ error: ApiError | null; success: boolean }> => {
      try {
        await registerApi({ username: user, password, password2 });
        return { error: null, success: true };
      } catch (err) {
        return {
          error: parseApiError(err, 'Registration failed. Please try again.'),
          success: false,
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await clearSession();
    useAuthStore.getState().logout();
    router.replace('/(auth)/login');
  }, []);

  return {
    accessToken,
    refreshToken,
    username,
    isAuthenticated,
    isHydrated,
    hydrate,
    login,
    register,
    logout,
  };
}
