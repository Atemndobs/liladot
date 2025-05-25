/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Recording type
 */
export interface Recording {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration: number;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: 'processing' | 'completed' | 'failed' | 'deleted';
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Transcript type
 */
export interface Transcript {
  id: string;
  recording_id: string;
  content: string;
  language: string;
  word_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

/**
 * File upload options
 */
export interface FileUploadOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
  metadata?: Record<string, string>;
}

/**
 * File download options
 */
export interface FileDownloadOptions {
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'origin' | 'avif' | 'webp' | 'jpeg' | 'jpg' | 'png';
  };
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
