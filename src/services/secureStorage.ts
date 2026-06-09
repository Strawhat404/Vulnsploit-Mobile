import * as SecureStore from 'expo-secure-store';

const KEYS = {
  access: 'vulnsploit_access_token',
  refresh: 'vulnsploit_refresh_token',
  username: 'vulnsploit_username',
} as const;

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export async function saveSession(
  accessToken: string,
  refreshToken: string,
  username: string
): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.access, accessToken),
    SecureStore.setItemAsync(KEYS.refresh, refreshToken),
    SecureStore.setItemAsync(KEYS.username, username),
  ]);
}

export async function loadSession(): Promise<StoredSession | null> {
  const [accessToken, refreshToken, username] = await Promise.all([
    SecureStore.getItemAsync(KEYS.access),
    SecureStore.getItemAsync(KEYS.refresh),
    SecureStore.getItemAsync(KEYS.username),
  ]);

  if (!accessToken || !refreshToken || !username) {
    return null;
  }

  return { accessToken, refreshToken, username };
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.access),
    SecureStore.deleteItemAsync(KEYS.refresh),
    SecureStore.deleteItemAsync(KEYS.username),
  ]);
}
