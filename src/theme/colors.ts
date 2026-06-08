/**
 * VulnSploit cyber theme — mirrors VulnSploit-FrontEnd tailwind tokens.
 * @see ../docs/MOBILE_APP_BRIEF.md
 */
export const colors = {
  primary: '#3b82f6',
  secondary: '#06b6d4',
  danger: '#ff0040',
  warning: '#f59e0b',
  success: '#60a5fa',

  bg: '#000000',
  surface: '#0d0d0f',
  surfaceDeep: '#050507',
  border: '#1a1d26',
  mutedBar: '#252830',

  text: '#e0e0e0',
  textMuted: '#6b7280',
  textDim: '#4a4a5a',

  status: {
    pending: '#f59e0b',
    running: '#06b6d4',
    completed: '#60a5fa',
    failed: '#ff0040',
  },

  severity: {
    critical: '#ff0040',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#3b82f6',
    info: '#6b7280',
  },
} as const;
