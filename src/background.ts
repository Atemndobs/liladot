// Background service worker for LilaDot
import { isMeetingUrl, detectMeetingPlatform, extractMeetingId } from './utils/meetingUtils';

// Types
interface Settings {
  autoStart: boolean;
  audioQuality: 'low' | 'medium' | 'high';
  saveTranscripts: boolean;
}

interface MessageResponse {
  success: boolean;
  error?: string;
  settings?: Settings;
}

// Listen for installation event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('LilaDot extension installed');
    // Initialize default settings
    const defaultSettings: Settings = {
      autoStart: false,
      audioQuality: 'high',
      saveTranscripts: true
    };
    chrome.storage.local.set({ settings: defaultSettings });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const { action, tabId } = request;
  
  const respond = (response: MessageResponse) => {
    if (chrome.runtime.lastError) {
      console.error('Runtime error:', chrome.runtime.lastError);
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
    } else {
      sendResponse(response);
    }
  };

  switch (action) {
    case 'START_RECORDING':
      handleStartRecording(tabId, respond);
      return true; // Required for async sendResponse
    case 'STOP_RECORDING':
      handleStopRecording(tabId, respond);
      return true;
    case 'GET_STATUS':
      handleGetStatus(respond);
      return true;
    default:
      return false;
  }
});

async function handleStartRecording(
  tabId: number, 
  sendResponse: (response: MessageResponse) => void
): Promise<void> {
  try {
    // Request tab capture permissions
    const streamId = await new Promise<string>((resolve, reject) => {
      chrome.tabCapture.getMediaStreamId({}, (streamId) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(streamId);
        }
      });
    });

    // Send stream ID to content script
    await chrome.tabs.sendMessage(tabId, {
      action: 'START_RECORDING',
      streamId
    });

    sendResponse({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error starting recording:', errorMessage);
    sendResponse({ 
      success: false, 
      error: errorMessage 
    });
  }
}

async function handleStopRecording(
  tabId: number, 
  sendResponse: (response: MessageResponse) => void
): Promise<void> {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'STOP_RECORDING'
    });
    sendResponse({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error stopping recording:', errorMessage);
    sendResponse({ 
      success: false, 
      error: errorMessage 
    });
  }
}

async function handleGetStatus(
  sendResponse: (response: MessageResponse & { settings?: Settings }) => void
): Promise<void> {
  try {
    const result = await chrome.storage.local.get('settings');
    const settings = result.settings as Settings;
    sendResponse({ success: true, settings });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get settings';
    console.error('Error getting status:', errorMessage);
    sendResponse({ 
      success: false, 
      error: errorMessage 
    });
  }
}

// Handle tab updates to detect meeting platforms
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if the URL matches a supported meeting platform
    if (isMeetingUrl(tab.url)) {
      // Inject content script
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content/meetingDetector.js']
      }).catch((error) => {
        console.error('Failed to inject content script:', error);
      });
    }
  }
});

// Meeting detection and handling functions moved to src/utils/meetingUtils.ts
