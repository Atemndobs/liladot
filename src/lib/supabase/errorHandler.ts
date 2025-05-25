/**
 * Error codes from Supabase
 * Reference: https://supabase.com/docs/reference/javascript/error-handling
 */
export enum SupabaseErrorCodes {
  // Authentication errors
  INVALID_CREDENTIALS = 'invalid_credentials',
  INVALID_REFRESH_TOKEN = 'invalid_refresh_token',
  TOKEN_EXPIRED = 'token_expired',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  INVALID_OTP = 'invalid_otp',
  
  // Storage errors
  BUCKET_NOT_FOUND = 'bucket_not_found',
  OBJECT_NOT_FOUND = 'object_not_found',
  NOT_AUTHORIZED = 'not_authorized',
  PAYLOAD_TOO_LARGE = 'payload_too_large',
  STORAGE_RATE_LIMIT_EXCEEDED = 'storage_rate_limit_exceeded',
  
  // Database errors
  DUPLICATE_ROW = '23505', // Unique violation
  FOREIGN_KEY_VIOLATION = '23503',
  NOT_NULL_VIOLATION = '23502',
  CHECK_VIOLATION = '23514',
  
  // Network errors
  NETWORK_ERROR = 'network_error',
  CONNECTION_REFUSED = 'ECONNREFUSED',
  
  // Generic errors
  UNKNOWN_ERROR = 'unknown_error',
  VALIDATION_ERROR = 'validation_error',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
}

export interface SupabaseError {
  code: string | null;
  message: string;
  details?: string;
  hint?: string;
  statusCode?: number;
  error?: string;
}

export class SupabaseErrorHandler {
  /**
   * Parse a Supabase error into a standardized format
   */
  public static parseError(error: any): SupabaseError {
    if (!error) {
      return {
        code: SupabaseErrorCodes.UNKNOWN_ERROR,
        message: 'An unknown error occurred',
      };
    }

    // Handle different error formats
    if (error.error_description || error.error) {
      // OAuth error format
      return {
        code: error.error || SupabaseErrorCodes.UNKNOWN_ERROR,
        message: error.error_description || error.message || 'Authentication error',
        statusCode: error.status || 400,
      };
    }

    if (error.code) {
      // Supabase error format
      return {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        statusCode: error.statusCode,
      };
    }

    if (error.message) {
      // Standard Error object
      return {
        code: SupabaseErrorCodes.UNKNOWN_ERROR,
        message: error.message,
      };
    }

    // Fallback for unknown error format
    return {
      code: SupabaseErrorCodes.UNKNOWN_ERROR,
      message: 'An unknown error occurred',
      details: JSON.stringify(error),
    };
  }

  /**
   * Check if the error is a network error
   */
  public static isNetworkError(error: any): boolean {
    if (!error) return false;
    
    const parsedError = this.parseError(error);
    return [
      SupabaseErrorCodes.NETWORK_ERROR,
      SupabaseErrorCodes.CONNECTION_REFUSED,
      'Failed to fetch',
      'Network request failed',
    ].some(code => 
      parsedError.code?.includes(code) || 
      parsedError.message?.includes(code) ||
      parsedError.details?.includes(code)
    );
  }

  /**
   * Check if the error is an authentication error
   */
  public static isAuthError(error: any): boolean {
    if (!error) return false;
    
    const parsedError = this.parseError(error);
    return [
      SupabaseErrorCodes.INVALID_CREDENTIALS,
      SupabaseErrorCodes.INVALID_REFRESH_TOKEN,
      SupabaseErrorCodes.TOKEN_EXPIRED,
      SupabaseErrorCodes.USER_NOT_FOUND,
      SupabaseErrorCodes.EMAIL_NOT_CONFIRMED,
      'Auth session missing',
      'Invalid token',
      'JWT expired',
    ].some(code => 
      parsedError.code?.includes(code) || 
      parsedError.message?.includes(code) ||
      parsedError.details?.includes(code)
    );
  }

  /**
   * Check if the error is a rate limit error
   */
  public static isRateLimitError(error: any): boolean {
    if (!error) return false;
    
    const parsedError = this.parseError(error);
    return [
      SupabaseErrorCodes.RATE_LIMIT_EXCEEDED,
      SupabaseErrorCodes.STORAGE_RATE_LIMIT_EXCEEDED,
      'rate limit',
      'too many requests',
      '429',
    ].some(code => 
      parsedError.code?.includes(code) || 
      parsedError.message?.toLowerCase().includes(code) ||
      parsedError.details?.toLowerCase().includes(code) ||
      parsedError.statusCode?.toString() === '429'
    );
  }

  /**
   * Get a user-friendly error message
   */
  public static getUserFriendlyMessage(error: any, context: string = ''): string {
    if (!error) return 'An unknown error occurred';
    
    const parsedError = this.parseError(error);
    
    // Handle specific error codes
    switch (parsedError.code) {
      case SupabaseErrorCodes.NETWORK_ERROR:
      case SupabaseErrorCodes.CONNECTION_REFUSED:
        return 'Unable to connect to the server. Please check your internet connection and try again.';
        
      case SupabaseErrorCodes.INVALID_CREDENTIALS:
      case SupabaseErrorCodes.INVALID_REFRESH_TOKEN:
      case SupabaseErrorCodes.TOKEN_EXPIRED:
        return 'Your session has expired. Please sign in again.';
        
      case SupabaseErrorCodes.EMAIL_NOT_CONFIRMED:
        return 'Please confirm your email address before continuing.';
        
      case SupabaseErrorCodes.PAYLOAD_TOO_LARGE:
        return 'The file is too large. Please try a smaller file.';
        
      case SupabaseErrorCodes.RATE_LIMIT_EXCEEDED:
      case SupabaseErrorCodes.STORAGE_RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please wait a moment and try again.';
        
      case SupabaseErrorCodes.DUPLICATE_ROW:
        return 'This record already exists.';
        
      case SupabaseErrorCodes.FOREIGN_KEY_VIOLATION:
        return 'A related record could not be found.';
        
      case SupabaseErrorCodes.NOT_NULL_VIOLATION:
        return 'A required field is missing.';
        
      case SupabaseErrorCodes.CHECK_VIOLATION:
        return 'The provided data is not valid.';
        
      default:
        // Try to extract a meaningful message
        if (parsedError.message) {
          // Remove any technical details in brackets
          let message = parsedError.message
            .replace(/\s*\([^)]*\)/g, '') // Remove text in parentheses
            .replace(/^[^:]+:\s*/, '') // Remove error codes at the start
            .trim();
          
          // Capitalize first letter
          if (message.length > 0) {
            message = message.charAt(0).toUpperCase() + message.slice(1);
            
            // Add period if missing
            if (!message.endsWith('.') && !message.endsWith('!') && !message.endsWith('?')) {
              message += '.';
            }
            
            return message;
          }
        }
        
        // Fallback to generic message
        return context 
          ? `An error occurred while ${context}. Please try again.`
          : 'An unexpected error occurred. Please try again.';
    }
  }
  
  /**
   * Log an error with additional context
   */
  public static logError(error: any, context: string = ''): void {
    const parsedError = this.parseError(error);
    const timestamp = new Date().toISOString();
    
    console.error(`[${timestamp}] Error${context ? ` in ${context}:` : ':'}`, {
      code: parsedError.code,
      message: parsedError.message,
      details: parsedError.details,
      hint: parsedError.hint,
      statusCode: parsedError.statusCode,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

export default SupabaseErrorHandler;
