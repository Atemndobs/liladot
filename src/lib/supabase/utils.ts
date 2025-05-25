import { supabase } from './client';
import { BUCKETS } from './database.types';

/**
 * Generate a unique file path for uploads
 * @param userId - The user's ID
 * @param fileName - The original file name
 * @param prefix - Optional prefix for the file path (e.g., 'recordings', 'transcripts')
 * @returns A unique file path
 */
export const generateFilePath = (
  userId: string,
  fileName: string,
  prefix: string = 'files'
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExt = fileName.split('.').pop();
  return `${userId}/${prefix}/${timestamp}-${randomString}.${fileExt}`;
};

/**
 * Get the public URL for a file
 * @param bucket - The bucket name
 * @param path - The file path
 * @returns The public URL for the file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Format file size to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Validate file type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is allowed
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in MB
 * @returns True if file size is within limit
 */
export const validateFileSize = (
  file: File,
  maxSizeInMB: number
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Get the appropriate bucket for a file type
 * @param fileType - The file MIME type
 * @returns The bucket name
 */
export const getBucketForFileType = (fileType: string): string => {
  if (fileType.startsWith('audio/')) {
    return BUCKETS.RECORDINGS;
  } else if (fileType.startsWith('text/')) {
    return BUCKETS.TRANSCRIPTS;
  } else if (fileType.startsWith('image/')) {
    return BUCKETS.USER_AVATARS;
  }
  return 'misc';
};

/**
 * Generate a signed URL for private files
 * @param bucket - The bucket name
 * @param path - The file path
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns A signed URL or null if error
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

/**
 * Parse error message from Supabase error
 * @param error - The error object
 * @returns A user-friendly error message
 */
export const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};
