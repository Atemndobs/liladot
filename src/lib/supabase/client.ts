import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import type { Tables, BUCKETS } from './types';

// Re-export types for convenience
export type { Tables, BUCKETS };

// Extend the SupabaseClient with our custom types
export interface TypedSupabaseClient extends SupabaseClient {
  // Add any custom methods here
}

// Helper to handle Supabase errors
const handleSupabaseError = (error: unknown, context: string): never => {
  console.error(`Supabase error in ${context}:`, error);
  
  let errorMessage = `Failed to ${context}`;
  if (error instanceof Error) {
    errorMessage += `: ${error.message}`;
  } else if (typeof error === 'string') {
    errorMessage += `: ${error}`;
  }
  
  throw new Error(errorMessage);
};

// Generate a unique ID
export const generateId = (): string => uuidv4();

// Helper function to create a typed Supabase client
function createTypedSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }) as TypedSupabaseClient;
}

// Create a single supabase client for interacting with your database
export const supabase = createTypedSupabaseClient();

// Storage operations
export const storage = {
  // Upload a file to storage
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob | ArrayBuffer,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ): Promise<{ path: string }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || 'binary/octet-stream',
        upsert: options?.upsert || false,
      });

    if (error) {
      handleSupabaseError(error, 'upload file to storage');
    }
    return data!;
  },

  // Download a file from storage
  async downloadFile(bucket: string, path: string): Promise<ArrayBuffer> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      handleSupabaseError(error, 'download file from storage');
    }
    return data!.arrayBuffer();
  },

  // Delete files from storage
  async deleteFile(bucket: string, paths: string | string[]): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(Array.isArray(paths) ? paths : [paths]);

    if (error) {
      handleSupabaseError(error, 'delete file from storage');
    }
  },

  // Get a public URL for a file
  getFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // List files in a bucket
  async listFiles(bucket: string, path: string = ''): Promise<Array<{ name: string; id: string; updated_at: string }>> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      handleSupabaseError(error, 'list files in bucket');
    }
    return data || [];
  },
};

// Database operations
export const db = {
  // Query a table with filters
  async query<T>(table: string, query: Record<string, unknown> = {}): Promise<T[]> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .match(query);

    if (error) {
      handleSupabaseError(error, `query ${table} table`);
    }
    return (data || []) as T[];
  },

  // Find a single record by ID
  async findById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') { // Not found
        return null;
      }
      handleSupabaseError(error, `find ${table} by id`);
    }
    return data as T;
  },

  // Insert a new record
  async insert<T>(table: string, record: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, `insert into ${table}`);
    }
    return data as T;
  },

  // Update a record by ID
  async update<T>(table: string, id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, `update ${table}`);
    }
    return data as T;
  },

  // Delete a record by ID
  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, `delete from ${table}`);
    }
  },

  // Upsert a record (insert or update)
  async upsert<T>(
    table: string,
    record: Partial<T> & { id?: string },
    onConflict = 'id'
  ): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .upsert(record, { onConflict, ignoreDuplicates: false })
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, `upsert into ${table}`);
    }
    return data as T;
  }
};

export default supabase;
