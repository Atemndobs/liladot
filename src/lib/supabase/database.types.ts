/**
 * Database table types
 */

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recordings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          duration: number;
          file_path: string;
          file_size: number;
          mime_type: string;
          status: 'processing' | 'completed' | 'failed' | 'deleted';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          duration: number;
          file_path: string;
          file_size: number;
          mime_type: string;
          status?: 'processing' | 'completed' | 'failed' | 'deleted';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          duration?: number;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          status?: 'processing' | 'completed' | 'failed' | 'deleted';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transcripts: {
        Row: {
          id: string;
          recording_id: string;
          content: string;
          language: string;
          word_count: number;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recording_id: string;
          content: string;
          language: string;
          word_count: number;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recording_id?: string;
          content?: string;
          language?: string;
          word_count?: number;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      // Add view types here if needed
    };
    Functions: {
      // Add function types here if needed
    };
    Enums: {
      // Add enum types here if needed
    };
  };
}

/**
 * Storage bucket names
 */
export const BUCKETS = {
  RECORDINGS: 'recordings',
  TRANSCRIPTS: 'transcripts',
  USER_AVATARS: 'user-avatars',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * Table names for type-safe database access
 */
export const TABLES = {
  PROFILES: 'profiles',
  RECORDINGS: 'recordings',
  TRANSCRIPTS: 'transcripts',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

/**
 * Re-export Supabase types for convenience
 */
export type Tables = Database['public']['Tables'];
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];
