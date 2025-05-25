import { db, storage, BUCKETS, type Tables } from './client';
import { v4 as uuidv4 } from 'uuid';

export interface TranscriptOptions {
  language?: string;
  speakerDiarization?: boolean;
  customVocabulary?: string[];
  // Add more options as needed
}

export class TranscriptService {
  private static instance: TranscriptService;

  private constructor() {}

  public static getInstance(): TranscriptService {
    if (!TranscriptService.instance) {
      TranscriptService.instance = new TranscriptService();
    }
    return TranscriptService.instance;
  }

  public async createTranscript(
    recordingId: string,
    content: string,
    options: TranscriptOptions = {}
  ): Promise<Tables['transcripts']['Row']> {
    try {
      const wordCount = this.countWords(content);
      
      const transcriptData: Tables['transcripts']['Insert'] = {
        recording_id: recordingId,
        content,
        language: options.language || 'en',
        word_count: wordCount,
      };

      const transcript = await db.insert('transcripts', transcriptData);
      
      if (!transcript) {
        throw new Error('Failed to create transcript record');
      }
      
      // Save transcript to storage as well
      await this.saveTranscriptToStorage(transcript.id, content);
      
      return transcript;
      
    } catch (error) {
      console.error('Error creating transcript:', error);
      throw error;
    }
  }
  
  public async getTranscript(transcriptId: string): Promise<{
    transcript: Tables['transcripts']['Row'];
    content: string;
  } | null> {
    try {
      const [transcript] = await db.query<Tables['transcripts']['Row']>('transcripts', {
        where: ['id', 'eq', transcriptId],
        limit: 1,
      });
      
      if (!transcript) return null;
      
      // Get the full content from storage
      const content = await this.getTranscriptContent(transcriptId);
      
      return { transcript, content };
      
    } catch (error) {
      console.error('Error getting transcript:', error);
      throw error;
    }
  }
  
  public async getTranscriptsForRecording(
    recordingId: string
  ): Promise<Tables['transcripts']['Row'][]> {
    try {
      return await db.query<Tables['transcripts']['Row']>('transcripts', {
        where: ['recording_id', 'eq', recordingId],
        orderBy: { column: 'created_at', ascending: false },
      });
    } catch (error) {
      console.error('Error getting transcripts for recording:', error);
      throw error;
    }
  }
  
  public async updateTranscript(
    transcriptId: string,
    updates: Partial<Tables['transcripts']['Update']>
  ): Promise<Tables['transcripts']['Row'] | null> {
    try {
      const updated = await db.update('transcripts', updates, 'id', transcriptId);
      
      // If content was updated, update the storage as well
      if (updates.content) {
        await this.saveTranscriptToStorage(transcriptId, updates.content);
        
        // Update word count if content changed
        if (updated) {
          const wordCount = this.countWords(updates.content);
          await db.update('transcripts', { word_count: wordCount }, 'id', transcriptId);
        }
      }
      
      return updated;
      
    } catch (error) {
      console.error('Error updating transcript:', error);
      throw error;
    }
  }
  
  public async deleteTranscript(transcriptId: string): Promise<boolean> {
    try {
      // Delete from storage
      await storage.deleteFile(BUCKETS.TRANSCRIPTS, `transcript_${transcriptId}.json`);
      
      // Delete the record
      await db.delete('transcripts', 'id', transcriptId);
      
      return true;
      
    } catch (error) {
      console.error('Error deleting transcript:', error);
      throw error;
    }
  }
  
  public async processRecording(recordingId: string): Promise<void> {
    try {
      // This would be called by a background worker or serverless function
      // to process the recording and generate a transcript
      
      // Update queue status
      await this.updateQueueStatus(recordingId, 'processing');
      
      // Get the recording
      const recording = await db.query<Tables['recordings']['Row']>('recordings', {
        where: ['id', 'eq', recordingId],
        limit: 1,
      }).then(r => r[0]);
      
      if (!recording) {
        throw new Error('Recording not found');
      }
      
      // In a real implementation, you would:
      // 1. Download the recording file
      // 2. Send it to a transcription service
      // 3. Process the results
      // 4. Save the transcript
      
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Create a mock transcript
      const mockTranscript = `This is a mock transcript for recording ${recordingId}. \n\n` +
        `Title: ${recording.title}\n` +
        `Date: ${new Date().toLocaleDateString()}\n\n` +
        `[00:00:00] Speaker 1: Hello, this is a test recording.\n` +
        `[00:00:05] Speaker 2: Yes, this is a test.\n` +
        `[00:00:10] Speaker 1: The quick brown fox jumps over the lazy dog.`;
      
      // Save the transcript
      await this.createTranscript(recordingId, mockTranscript, {
        language: 'en',
      });
      
      // Update recording status
      await db.update('recordings', { 
        status: 'completed',
        is_processed: true,
        updated_at: new Date().toISOString() 
      }, 'id', recordingId);
      
      // Update queue status
      await this.updateQueueStatus(recordingId, 'completed');
      
    } catch (error) {
      console.error('Error processing recording:', error);
      
      // Update status to failed
      await db.update('recordings', { 
        status: 'failed',
        updated_at: new Date().toISOString() 
      }, 'id', recordingId);
      
      // Update queue status
      await this.updateQueueStatus(recordingId, 'failed', error instanceof Error ? error.message : 'Unknown error');
      
      throw error;
    }
  }
  
  private async updateQueueStatus(
    recordingId: string,
    status: Tables['processing_queue']['Row']['status'],
    error: string | null = null
  ): Promise<void> {
    try {
      // Find the queue item
      const [queueItem] = await db.query<Tables['processing_queue']['Row']>('processing_queue', {
        where: ['recording_id', 'eq', recordingId],
        orderBy: { column: 'created_at', ascending: false },
        limit: 1,
      });
      
      if (queueItem) {
        const updates: Partial<Tables['processing_queue']['Update']> = {
          status,
          last_attempt_at: new Date().toISOString(),
          error,
        };
        
        if (status === 'processing' || status === 'failed') {
          updates.attempts = (queueItem.attempts || 0) + 1;
        }
        
        await db.update('processing_queue', updates, 'id', queueItem.id);
      }
    } catch (error) {
      console.error('Error updating queue status:', error);
      // Don't throw, as this is a non-critical operation
    }
  }
  
  private async saveTranscriptToStorage(transcriptId: string, content: string): Promise<void> {
    try {
      const blob = new Blob([content], { type: 'application/json' });
      await storage.uploadFile(
        BUCKETS.TRANSCRIPTS,
        `transcript_${transcriptId}.json`,
        blob,
        {
          contentType: 'application/json',
          cacheControl: '31536000', // 1 year
        }
      );
    } catch (error) {
      console.error('Error saving transcript to storage:', error);
      throw error;
    }
  }
  
  private async getTranscriptContent(transcriptId: string): Promise<string> {
    try {
      const file = await storage.downloadFile(
        BUCKETS.TRANSCRIPTS,
        `transcript_${transcriptId}.json`
      );
      
      if (!file) {
        throw new Error('Transcript file not found in storage');
      }
      
      return await file.text();
      
    } catch (error) {
      console.error('Error getting transcript content:', error);
      throw error;
    }
  }
  
  private countWords(text: string): number {
    if (!text) return 0;
    // Simple word count - split by whitespace and filter out empty strings
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const transcriptService = TranscriptService.getInstance();
