import { isAxiosError } from 'axios';

export type ApiErrorType = 'network' | 'auth' | 'rate' | 'server' | 'validation' | 'unknown';

export interface ApiError {
  message: string;
  type: ApiErrorType;
}

function firstFieldError(data: Record<string, unknown>): string | null {
  for (const field of ['username', 'password', 'password2', 'non_field_errors', 'detail']) {
    const val = data[field];
    if (val) {
      return Array.isArray(val) ? String(val[0]) : String(val);
    }
  }

  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    return `${firstKey}: ${Array.isArray(val) ? val[0] : String(val)}`;
  }

  return null;
}

export function parseApiError(err: unknown, fallback = 'Request failed. Please try again.'): ApiError {
  if (!isAxiosError(err)) {
    return { message: fallback, type: 'unknown' };
  }

  if (!err.response) {
    return {
      message: 'Cannot reach the server. Check EXPO_PUBLIC_API_URL and that the backend is running.',
      type: 'network',
    };
  }

  const { status, data } = err.response;

  if (status === 429) {
    return { message: 'Too many attempts. Please wait and try again.', type: 'rate' };
  }

  if (status === 401 || status === 400) {
    const detail =
      typeof data === 'object' && data !== null
        ? firstFieldError(data as Record<string, unknown>)
        : null;
    return {
      message: detail ?? 'Invalid username or password.',
      type: 'auth',
    };
  }

  if (status >= 500) {
    return { message: `Server error (${status}). Check backend logs.`, type: 'server' };
  }

  if (typeof data === 'object' && data !== null) {
    const fieldError = firstFieldError(data as Record<string, unknown>);
    if (fieldError) {
      return { message: fieldError, type: 'validation' };
    }
  }

  return { message: fallback, type: 'unknown' };
}
