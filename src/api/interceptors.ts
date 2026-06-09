import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken } from '@/api/auth';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { clearSession, saveSession } from '@/services/secureStorage';

let refreshPromise: Promise<string | null> | null = null;

async function logoutSession(): Promise<void> {
  await clearSession();
  useAuthStore.getState().logout();
}

async function tryRefreshToken(): Promise<string | null> {
  const { refreshToken, username } = useAuthStore.getState();
  if (!refreshToken) {
    await logoutSession();
    return null;
  }

  try {
    const access = await refreshAccessToken(refreshToken);
    useAuthStore.getState().setTokens(access, refreshToken, username ?? undefined);
    if (username) {
      await saveSession(access, refreshToken, username);
    }
    return access;
  } catch {
    await logoutSession();
    return null;
  }
}

export function setupApiInterceptors(): void {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (error.response?.status !== 401 || !original || original._retry) {
        return Promise.reject(error);
      }

      const url = original.url ?? '';
      if (url.includes('/token/') || url.includes('/register/')) {
        return Promise.reject(error);
      }

      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = tryRefreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      const access = await refreshPromise;
      if (!access) {
        return Promise.reject(error);
      }

      original.headers.Authorization = `Bearer ${access}`;
      return apiClient(original);
    }
  );
}
