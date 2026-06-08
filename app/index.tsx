import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Entry redirect — Phase 1 will hydrate tokens from SecureStore before routing.
 */
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
