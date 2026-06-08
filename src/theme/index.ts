export { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  fontFamily: 'System',
  // Load JetBrains Mono via expo-font in app/_layout.tsx (Phase 1)
  fontFamilyMono: 'SpaceMono',
} as const;
