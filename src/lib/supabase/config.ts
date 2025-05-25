/**
 * Supabase Configuration
 * 
 * This file contains configuration for the Supabase client.
 * For security, sensitive values should be stored in environment variables.
 */

// Environment variables - these should be set in your build process
const ENV = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  
  // Feature flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // API endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  
  // Storage
  UPLOAD_CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_UPLOAD_SIZE: 100 * 1024 * 1024, // 100MB
  
  // Authentication
  AUTH_COOKIE_NAME: 'sb-access-token',
  AUTH_REFRESH_COOKIE_NAME: 'sb-refresh-token',
  AUTH_TOKEN_EXPIRY: 3600, // 1 hour in seconds
  
  // Realtime
  REALTIME_ENABLED: process.env.NEXT_PUBLIC_REALTIME_ENABLED === 'true',
  
  // Logging
  LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
} as const;

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'] as const;
  
  requiredVars.forEach((key) => {
    if (!ENV[key]) {
      const message = `Missing required environment variable: ${key}`;
      if (process.env.NODE_ENV === 'production') {
        throw new Error(message);
      } else {
        console.warn(`[WARNING] ${message}`);
      }
    }
  });
};

// Run validation
if (typeof window !== 'undefined') {
  validateConfig();
}

// Export configuration
export default ENV;

// Re-export for backward compatibility
export const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ENABLE_ANALYTICS,
  API_BASE_URL,
  UPLOAD_CHUNK_SIZE,
  MAX_UPLOAD_SIZE,
  AUTH_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  AUTH_TOKEN_EXPIRY,
  REALTIME_ENABLED,
  LOG_LEVEL,
} = ENV;
