// Type definitions for messaging utilities
declare module '../utils/messaging' {
  export type MessageType = 
    | 'START_RECORDING'
    | 'STOP_RECORDING'
    | 'RECORDING_STARTED'
    | 'RECORDING_STOPPED'
    | 'MEETING_DETECTED'
    | 'MEETING_ENDED'
    | 'ERROR';

  export interface Message {
    type: MessageType;
    payload?: any;
    error?: string;
  }

  export const sendMessageToBackground: (
    type: MessageType,
    payload?: any
  ) => Promise<any>;

  export const sendMessageToTab: (
    tabId: number,
    type: MessageType,
    payload?: any
  ) => Promise<any>;

  export const addMessageListener: (
    handler: (message: Message, sender: chrome.runtime.MessageSender) => void | Promise<any>
  ) => () => void;
}
