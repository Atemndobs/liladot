import { storage, BUCKETS } from './client';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  path: string;
  url: string;
}

export class FileUtils {
  /**
   * Get file metadata
   */
  public static async getFileMetadata(file: File): Promise<FileMetadata> {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      path: '',
      url: ''
    };
  }

  /**
   * Generate a unique file path
   */
  public static generateFilePath(
    userId: string,
    fileName: string,
    timestamp: number = Date.now()
  ): string {
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
    const safeName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_')      // Replace multiple underscores with one
      .replace(/^_+|_+$/g, '');    // Remove leading/trailing underscores

    return `${userId}/${timestamp}_${safeName}.${fileExt}`;
  }

  /**
   * Get file extension from filename or path
   */
  public static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if a file type is supported for upload
   */
  public static isSupportedFileType(
    file: File,
    allowedTypes: string[] = ['audio/*', 'video/*', 'application/octet-stream']
  ): boolean {
    if (!file.type) return false;
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Handle wildcard types like 'audio/*'
        return file.type.startsWith(type.split('/*')[0]);
      }
      return file.type === type;
    });
  }

  /**
   * Format file size to human-readable format
   */
  public static formatFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Clean up temporary files
   */
  public static async cleanupTemporaryFiles(
    bucket: string = BUCKETS.TEMP,
    olderThanHours: number = 24
  ): Promise<void> {
    try {
      const threshold = new Date();
      threshold.setHours(threshold.getHours() - olderThanHours);
      
      // List all files in the temp bucket
      const { data: files, error } = await storage
        .from(bucket)
        .list();
      
      if (error) throw error;
      
      // Filter files older than the threshold
      const oldFiles = files
        .filter(file => {
          const fileDate = new Date(file.created_at || 0);
          return fileDate < threshold;
        })
        .map(file => file.name);
      
      // Delete old files
      if (oldFiles.length > 0) {
        await storage.deleteFile(bucket, oldFiles);
        console.log(`Cleaned up ${oldFiles.length} temporary files`);
      }
      
    } catch (error) {
      console.error('Error cleaning up temporary files:', error);
      // Don't throw, as this is a background cleanup task
    }
  }

  /**
   * Convert a file to base64 string
   */
  public static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Generate a file hash for deduplication
   */
  public static async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Check if a file exists in storage
   */
  public static async fileExists(
    bucket: string,
    path: string
  ): Promise<boolean> {
    try {
      const { data } = await storage
        .from(bucket)
        .getPublicUrl(path);
      
      // Try to fetch the file to check if it exists
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default FileUtils;
