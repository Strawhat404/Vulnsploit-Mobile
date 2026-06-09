import axios from 'axios';
import { env } from '@/config/env';
import { apiClient } from '@/api/client';
import type { TokenPair } from '@/types/api';

export interface RegisterPayload {
  username: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await apiClient.post<TokenPair>('/token/', payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<{ detail: string }> {
  const { data } = await apiClient.post<{ detail: string }>('/register/', payload);
  return data;
}

/** Uses raw axios to avoid interceptor loops during refresh. */
export async function refreshAccessToken(refresh: string): Promise<string> {
  const { data } = await axios.post<{ access: string }>(
    `${env.apiUrl}/api/token/refresh/`,
    { refresh },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data.access;
}
