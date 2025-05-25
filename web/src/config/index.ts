// Environment variables with fallbacks
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  dashboardUrl: '/dashboard',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;
