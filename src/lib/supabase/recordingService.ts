import { db, storage, BUCKETS, type Tables, type UploadProgress } from './client';
import { v4 as uuidv4 } from 'uuid';

export interface RecordingUploadOptions {
  file: File;
  title: string;
  description?: string;
  meetingPlatform?: string;
  meetingId?: string;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (recording: Tables['recordings']['Row']) => void;
  onError?: (error: Error) => void;
}

export class RecordingService {
  private static instance: RecordingService;
  private uploadQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for large files
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  private constructor() {}

  public static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService();
    }
    return RecordingService.instance;
  }

  private async processQueue() {
    if (this.isProcessing || this.uploadQueue.length === 0) return;
    
    this.isProcessing = true;
    const task = this.uploadQueue.shift();
    
    if (task) {
      try {
        await task();
      } catch (error) {
        console.error('Error processing upload task:', error);
      } finally {
        this.isProcessing = false;
        this.processQueue(); // Process next task in queue
      }
    }
  }

  private generateFilePath(userId: string, fileName: string): string {
    const timestamp = Date.now();
    const fileExt = fileName.split('.').pop();
    const uniqueId = uuidv4();
    return `${userId}/${timestamp}-${uniqueId}.${fileExt}`;
  }

  private async uploadWithProgress(
    bucket: string,
    path: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ) {
    const fileSize = file.size;
    let uploadedBytes = 0;
    let startTime = Date.now();
    let lastProgressTime = startTime;
    let lastUploadedBytes = 0;

    // For small files, upload in one go
    if (fileSize <= this.CHUNK_SIZE) {
      await storage.uploadFile(bucket, path, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });
      
      if (onProgress) {
        onProgress({
          loaded: fileSize,
          total: fileSize,
          progress: 100,
          speed: 0,
          timeRemaining: 0,
        });
      }
      return;
    }

    // For large files, upload in chunks
    const chunks = Math.ceil(fileSize / this.CHUNK_SIZE);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(fileSize, start + this.CHUNK_SIZE);
      const chunk = file.slice(start, end);
      
      let retries = 0;
      let success = false;
      
      while (retries < this.MAX_RETRIES && !success) {
        try {
          await storage.uploadFile(
            bucket,
            `${path}.part${i}`,
            chunk,
            {
              contentType: file.type,
              cacheControl: '3600',
              upsert: true,
            }
          );
          
          uploadedBytes += chunk.size;
          success = true;
          
          // Calculate progress
          const now = Date.now();
          const timeElapsed = (now - lastProgressTime) / 1000; // in seconds
          const bytesUploaded = uploadedBytes - lastUploadedBytes;
          const uploadSpeed = timeElapsed > 0 ? bytesUploaded / timeElapsed : 0;
          const remainingBytes = fileSize - uploadedBytes;
          const timeRemaining = uploadSpeed > 0 ? remainingBytes / uploadSpeed : 0;
          
          const progress = (uploadedBytes / fileSize) * 100;
          
          if (onProgress) {
            onProgress({
              loaded: uploadedBytes,
              total: fileSize,
              progress,
              speed: uploadSpeed,
              timeRemaining,
            });
          }
          
          lastProgressTime = now;
          lastUploadedBytes = uploadedBytes;
          
        } catch (error) {
          retries++;
          if (retries >= this.MAX_RETRIES) {
            throw new Error(`Failed to upload chunk ${i} after ${this.MAX_RETRIES} attempts: ${error}`);
          }
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * retries));
        }
      }
    }
    
    // After all chunks are uploaded, combine them
    await this.combineChunks(bucket, path, chunks);
  }

  private async combineChunks(bucket: string, path: string, chunkCount: number) {
    // In a real implementation, you would use Supabase Storage API to combine chunks
    // For now, we'll simulate this with a serverless function
    console.log(`Combining ${chunkCount} chunks for ${path}`);
    // In a real app, you would call a serverless function to handle this
  }

  public async uploadRecording(options: RecordingUploadOptions): Promise<Tables['recordings']['Row']> {
    const {
      file,
      title,
      description,
      meetingPlatform,
      meetingId,
      onProgress,
      onComplete,
      onError,
    } = options;

    // Get current user ID (you'll need to implement this)
    const userId = await this.getCurrentUserId();
    
    // Generate a unique file path
    const filePath = this.generateFilePath(userId, file.name);
    
    // Create a recording record in the database
    const recordingData: Tables['recordings']['Insert'] = {
      user_id: userId,
      title,
      description: description || null,
      duration: 0, // Will be updated later
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      meeting_platform: meetingPlatform || null,
      meeting_id: meetingId || null,
      is_processed: false,
      status: 'pending',
    };

    try {
      // Insert the recording record
      const recording = await db.insert('recordings', recordingData);
      
      if (!recording) {
        throw new Error('Failed to create recording record');
      }
      
      // Add to upload queue
      this.uploadQueue.push(async () => {
        try {
          // Update status to processing
          await db.update('recordings', { status: 'processing' }, 'id', recording.id);
          
          // Upload the file
          await this.uploadWithProgress(
            BUCKETS.RECORDINGS,
            filePath,
            file,
            onProgress
          );
          
          // Update recording with final details
          const updatedRecording = await db.update(
            'recordings',
            { 
              status: 'completed',
              updated_at: new Date().toISOString() 
            },
            'id',
            recording.id
          );
          
          if (onComplete && updatedRecording) {
            onComplete(updatedRecording);
          }
          
          // Add to processing queue for transcription
          await this.addToProcessingQueue(recording.id);
          
        } catch (error) {
          // Update status to failed
          await db.update(
            'recordings',
            { 
              status: 'failed',
              updated_at: new Date().toISOString() 
            },
            'id',
            recording.id
          );
          
          if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)));
          } else {
            throw error;
          }
        }
      });
      
      // Process the queue
      this.processQueue();
      
      return recording;
      
    } catch (error) {
      console.error('Error in uploadRecording:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }
  
  private async addToProcessingQueue(recordingId: string): Promise<void> {
    try {
      await db.insert('processing_queue', {
        recording_id: recordingId,
        status: 'pending',
        attempts: 0,
        last_attempt_at: null,
        error: null,
      });
    } catch (error) {
      console.error('Error adding to processing queue:', error);
      throw error;
    }
  }
  
  private async getCurrentUserId(): Promise<string> {
    // In a real app, you would get this from your auth system
    // For now, we'll use a mock user ID
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Add other methods for managing recordings (get, list, delete, etc.)
  
  public async getRecording(id: string): Promise<Tables['recordings']['Row'] | null> {
    try {
      const [recording] = await db.query<Tables['recordings']['Row']>('recordings', {
        where: ['id', 'eq', id],
        limit: 1,
      });
      return recording || null;
    } catch (error) {
      console.error('Error getting recording:', error);
      throw error;
    }
  }
  
  public async listRecordings(userId: string, limit = 20, offset = 0): Promise<Tables['recordings']['Row'][]> {
    try {
      return await db.query<Tables['recordings']['Row']>('recordings', {
        where: ['user_id', 'eq', userId],
        orderBy: { column: 'created_at', ascending: false },
        limit,
      });
    } catch (error) {
      console.error('Error listing recordings:', error);
      throw error;
    }
  }
  
  public async deleteRecording(id: string): Promise<boolean> {
    try {
      // First get the recording to get the file path
      const recording = await this.getRecording(id);
      
      if (!recording) {
        throw new Error('Recording not found');
      }
      
      // Delete the file from storage
      await storage.deleteFile(BUCKETS.RECORDINGS, recording.file_path);
      
      // Delete any associated transcripts
      await this.deleteTranscripts(id);
      
      // Delete the recording record
      await db.delete('recordings', 'id', id);
      
      return true;
    } catch (error) {
      console.error('Error deleting recording:', error);
      throw error;
    }
  }
  
  private async deleteTranscripts(recordingId: string): Promise<void> {
    try {
      // Get all transcripts for this recording
      const transcripts = await db.query<Tables['transcripts']['Row']>('transcripts', {
        where: ['recording_id', 'eq', recordingId],
      });
      
      // Delete transcript files from storage
      await Promise.all(
        transcripts.map(t => 
          storage.deleteFile(BUCKETS.TRANSCRIPTS, `transcript_${t.id}.json`)
        )
      );
      
      // Delete transcript records
      await db.delete('transcripts', 'recording_id', recordingId);
    } catch (error) {
      console.error('Error deleting transcripts:', error);
      throw error;
    }
  }
}

export const recordingService = RecordingService.getInstance();
