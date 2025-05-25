// Database schema types for Supabase
export type Tables = {
  recordings: {
    Row: {
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      duration: number | null;
      file_path: string;
      file_size: number;
      mime_type: string;
      meeting_platform: string | null;
      meeting_id: string | null;
      created_at: string;
      updated_at: string;
      is_processed: boolean;
      status: 'pending' | 'processing' | 'completed' | 'failed';
    };
    Insert: Omit<Tables['recordings']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Tables['recordings']['Row'], 'id' | 'created_at' | 'user_id'>>;
  };
  
  transcripts: {
    Row: {
      id: string;
      recording_id: string;
      content: string;
      language: string;
      word_count: number;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['transcripts']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Tables['transcripts']['Row'], 'id' | 'created_at' | 'recording_id'>>;
  };
  
  processing_queue: {
    Row: {
      id: string;
      recording_id: string;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      attempts: number;
      last_attempt_at: string | null;
      error: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['processing_queue']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Tables['processing_queue']['Row'], 'id' | 'created_at' | 'recording_id'>>;
  };
};

// Storage bucket names
export const BUCKETS = {
  RECORDINGS: 'recordings',
  TRANSCRIPTS: 'transcripts',
  EXPORTS: 'exports',
} as const;

// Custom types
export type RecordingStatus = Tables['recordings']['Row']['status'];
export type ProcessingStatus = Tables['processing_queue']['Row']['status'];

// File upload types
export interface FileUploadOptions {
  path: string;
  file: File | Blob | ArrayBuffer;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  progress: number;
  speed: number;
  timeRemaining: number;
}
