// Core Supabase client and types
export { supabase } from './client';

// Database types and constants
export { BUCKETS, TABLES } from './database.types';

// Database types
export type {
  Tables,
  TableRow,
  TableInsert,
  TableUpdate,
  Database,
  BucketName,
  TableName
} from './database.types';

// Shared types
export type {
  UserProfile,
  Recording,
  Transcript,
  FileUploadOptions,
  FileDownloadOptions,
  PaginationOptions,
  PaginatedResponse
} from './shared.types';

// Services
export * from './auth';
export * from './recordingService';
export * from './transcriptService';

// Utility functions
export * from './utils';
export * from './db-utils';

// Error handling
export * from './errorHandler';

// Configuration
export * from './config';

// Export default Supabase client for convenience
export { supabase as default } from './client';
