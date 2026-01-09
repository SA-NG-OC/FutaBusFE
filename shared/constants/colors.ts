/**
 * Brand Color Palette
 * Use these constants throughout the app for consistent theming
 */

export const COLORS = {
  // Primary Colors - For main actions, CTAs, important UI elements
  primary: '#D83E3E',
  primaryDark: '#8B1A1A',
  primaryLight: '#FF6B6B',
  
  // Secondary Colors - For complementary elements, highlights
  secondary: '#F5EFE1',
  secondaryDark: '#ECDDC0',
  
  // Background Colors
  background: '#EAEAEA',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#F5F5F5',
  
  // Text Colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#29B6F6',
  
  // UI Element Colors
  border: '#DDDDDD',
  borderLight: '#EEEEEE',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

/**
 * CSS Tailwind compatible color classes
 * Usage in className: `bg-[${TAILWIND_COLORS.primary}]`
 */
export const TAILWIND_COLORS = {
  primary: '#D83E3E',
  'primary-dark': '#8B1A1A',
  secondary: '#F5EFE1',
  'secondary-dark': '#ECDDC0',
  background: '#EAEAEA',
} as const;

export type ColorKey = keyof typeof COLORS;
