/**
 * Messaging utilities for Chrome extension message passing
 * Handles communication between popup, content scripts, and background
 */

// Export message types as a const object for better type safety
export interface Participant {
  id: string;
  name: string;
  email?: string;
  isHost?: boolean;
  joinedAt?: number;
  leftAt?: number;
}

export interface MeetingInfo {
  platform: string;
  meetingId: string | null;
  title?: string;
  startTime?: number;
  participants: Participant[];
}

export const MessageType = {
  START_RECORDING: 'START_RECORDING',
  STOP_RECORDING: 'STOP_RECORDING',
  RECORDING_STARTED: 'RECORDING_STARTED',
  RECORDING_STOPPED: 'RECORDING_STOPPED',
  MEETING_DETECTED: 'MEETING_DETECTED',
  MEETING_ENDED: 'MEETING_ENDED',
  GET_RECORDING_STATE: 'GET_RECORDING_STATE',
  GET_MEETING_INFO: 'GET_MEETING_INFO',
  PARTICIPANTS_UPDATED: 'PARTICIPANTS_UPDATED',
  ERROR: 'ERROR',
} as const;

// Type for message type values
export type MessageType = typeof MessageType[keyof typeof MessageType];

// Type for recording state response
export interface RecordingStateResponse {
  success: boolean;
  error?: string;
  isRecording: boolean;
  startTime?: number;
}

// Re-export commonly used Chrome types for convenience
export type MessageSender = chrome.runtime.MessageSender;

/**
 * Type guard to check if a value is a valid message type
 */
export function isMessageType(value: unknown): value is MessageType {
  return Object.values(MessageType).includes(value as MessageType);
}

/**
 * Send a message to the background script
 * @param type The message type
 * @param data Optional data to send with the message
 * @returns Promise that resolves with the response
 */
// Extended message type that includes the message type and data
type MessageWithType<T> = {
  type: MessageType;
  data?: T;
};

export function sendMessageToBackground<T = void, R = void>(
  type: MessageType | MessageWithType<T>,
  data?: T
): Promise<R> {
  // Handle both object-style and simple type + data style
  const messageObj = typeof type === 'object' ? type : { type, data };
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        messageObj,
        (response: R | undefined) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response as R);
        }
      );
    } catch (error) {
      console.error('Error sending message:', { type, error });
      reject(error);
    }
  });
}

/**
 * Send a message to a specific tab
 * @param tabId The ID of the tab to send the message to
 * @param type The message type
 * @param data Optional data to send with the message
 * @returns Promise that resolves with the response
 */
export function sendMessageToTab<T = void, R = void>(
  tabId: number,
  type: MessageType,
  data?: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(
        tabId,
        { type, data },
        (response: R | undefined) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response as R);
        }
      );
    } catch (error) {
      console.error('Error sending message to tab:', { tabId, type, error });
      reject(error);
    }
  });
}

/**
 * Add a message listener
 * @param handler Function to handle incoming messages
 * @returns Function to remove the listener
 */
export function addMessageListener<T = unknown, R = void>(
  handler: (
    message: { type: MessageType; data: T },
    sender: MessageSender,
    sendResponse: (response?: R) => void
  ) => void | boolean | Promise<void> | Promise<boolean>
): () => void {
  const wrappedHandler = (
    message: unknown,
    sender: MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean | void => {
    if (
      message &&
      typeof message === 'object' &&
      'type' in message &&
      isMessageType(message.type)
    ) {
      const result = handler(
        message as { type: MessageType; data: T },
        sender,
        sendResponse as (response?: R) => void
      );

      // Return true to indicate we want to send a response asynchronously
      if (result instanceof Promise) {
        result.then((shouldSendResponse) => {
          if (shouldSendResponse !== false) {
            sendResponse();
          }
        });
        return true;
      }

      return result;
    }
  };

  chrome.runtime.onMessage.addListener(wrappedHandler);

  // Return a function to remove this listener
  return () => {
    chrome.runtime.onMessage.removeListener(wrappedHandler);
  };
}

// MessageSender is already exported above
