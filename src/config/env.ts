/**
 * Typed access to Expo public environment variables.
 * Copy .env.example → .env before running the app.
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8001',
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30_000),
  debugApi: process.env.EXPO_PUBLIC_DEBUG_API === 'true',
} as const;
