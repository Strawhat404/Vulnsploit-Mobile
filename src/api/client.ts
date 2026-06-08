import axios from 'axios';
import { env } from '@/config/env';

/**
 * Axios instance — JWT interceptors added in Phase 1 (src/api/interceptors.ts).
 */
export const apiClient = axios.create({
  baseURL: `${env.apiUrl}/api`,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (env.debugApi) {
  apiClient.interceptors.request.use((config) => {
    console.log('[API]', config.method?.toUpperCase(), config.url);
    return config;
  });
}
