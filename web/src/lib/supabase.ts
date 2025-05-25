import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Re-export types for convenience
export * from '@supabase/supabase-js';

// Helper function to handle errors
export const handleSupabaseError = (error: unknown, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  const errorMessage =
    error instanceof Error ? error.message : `An error occurred while ${context.toLowerCase()}`;
  throw new Error(errorMessage);
};

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to generate a unique file path
export const generateFilePath = (
  userId: string,
  fileName: string,
  folder = 'recordings'
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExt = fileName.split('.').pop();
  return `${userId}/${folder}/${timestamp}-${randomString}.${fileExt}`;
};

// Storage operations
export const storage = {
  // Upload a file to storage
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false,
    });

    if (error) {
      handleSupabaseError(error, 'uploading file');
    }

    return data;
  },

  // Get a public URL for a file
  async getFileUrl(bucket: string, path: string) {
    const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // Download a file from storage
  async downloadFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      handleSupabaseError(error, 'downloading file');
    }
    return data;
  },

  // List files in a bucket
  async listFiles(bucket: string, path: string = '') {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) {
      handleSupabaseError(error, 'listing files');
    }
    return data || [];
  },
};

// Database operations
export const db = {
  // Query a table with filters
  async query<T>(table: string, query: Record<string, unknown> = {}) {
    const { data, error } = await supabase.from(table).select('*').match(query);
    if (error) {
      handleSupabaseError(error, `querying ${table}`);
    }
    return (data || []) as T[];
  },

  // Find a single record by ID
  async findById<T>(table: string, id: string) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      handleSupabaseError(error, `finding ${table} by id`);
    }
    return data as T | null;
  },

  // Insert a new record
  async insert<T>(table: string, record: Omit<T, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from(table).insert(record).select().single();

    if (error) {
      handleSupabaseError(error, `inserting into ${table}`);
    }
    return data as T;
  },

  // Update a record by ID
  async update<T>(table: string, id: string, updates: Partial<T>) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, `updating ${table}`);
    }
    return data as T;
  },

  // Delete a record by ID
  async delete(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      handleSupabaseError(error, `deleting from ${table}`);
    }
  },
};
