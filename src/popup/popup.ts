import { isMeetingUrl, detectMeetingPlatform, extractMeetingId } from '../utils/meetingUtils';

// Types
interface MeetingInfo {
  platform: string;
  meetingId: string | null;
  participants: string[];
}

type StatusType = 'info' | 'error' | 'success';

// DOM Elements with proper type assertions and null checks
const recordBtn = document.getElementById('record-btn') as HTMLButtonElement | null;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement | null;
const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement | null;
const statusText = document.getElementById('status-text') as HTMLSpanElement | null;
const statusDot = document.querySelector('.status-dot') as HTMLSpanElement | null;
const meetingInfoEl = document.getElementById('meeting-info') as HTMLDivElement | null;
const meetingPlatformEl = document.getElementById('meeting-platform') as HTMLSpanElement | null;
const meetingDurationEl = document.getElementById('meeting-duration') as HTMLSpanElement | null;
const participantCountEl = document.getElementById('participant-count') as HTMLSpanElement | null;

// Verify all required DOM elements are present
const requiredElements = {
  recordBtn,
  stopBtn,
  settingsBtn,
  statusText,
  statusDot,
  meetingInfoEl,
  meetingPlatformEl,
  meetingDurationEl,
  participantCountEl
} as const;

function verifyDomElements() {
  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Required DOM element not found: ${key}`);
      return false;
    }
  }
  return true;
}

// State
let isRecording = false;
let meetingDetected = false;
let recordingStartTime: number | null = null;
let durationInterval: NodeJS.Timeout | null = null;

// Initialize popup
async function init() {
  try {
    // Verify all required DOM elements are present
    if (!verifyDomElements()) {
      updateStatus('Failed to initialize: Missing required elements', 'error');
      return;
    }

    // Check current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.id) {
      updateStatus('No active tab found', 'error');
      return;
    }

    // Check if we're on a meeting page
    if (tab.url) {
      checkMeetingDetection(tab);
    } else {
      updateStatus('Unable to detect meeting: No URL available', 'error');
    }
    
    // Check recording status
    checkRecordingStatus(tab.id);
    
    // Set up event listeners
    setupEventListeners(tab.id);
  } catch (error) {
    console.error('Error initializing popup:', error);
    updateStatus('Failed to initialize extension', 'error');
  }
}

function setupEventListeners(tabId: number) {
  if (!recordBtn || !stopBtn || !settingsBtn) {
    console.error('Required DOM elements not found');
    return;
  }

  // Record button
  recordBtn.addEventListener('click', async () => {
    try {
      recordBtn.disabled = true;
      updateStatus('Starting recording...');
      
      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        action: 'START_RECORDING',
        tabId
      });
      
      if (response.success) {
        isRecording = true;
        recordingStartTime = Date.now();
        updateUI();
        startDurationTimer();
      } else {
        updateStatus('Failed to start recording', 'error');
        console.error('Recording error:', response.error);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      updateStatus('Error starting recording', 'error');
    } finally {
      recordBtn.disabled = false;
    }
  });

  // Stop button
  stopBtn.addEventListener('click', async () => {
    try {
      stopBtn.disabled = true;
      updateStatus('Stopping recording...');
      
      const response = await chrome.runtime.sendMessage({
        action: 'STOP_RECORDING',
        tabId
      });
      
      if (response.success) {
        isRecording = false;
        recordingStartTime = null;
        stopDurationTimer();
        updateStatus('Recording saved');
        updateUI();
      } else {
        updateStatus('Failed to stop recording', 'error');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      updateStatus('Error stopping recording', 'error');
    } finally {
      stopBtn.disabled = false;
    }
  });

  // Settings button
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

async function checkMeetingDetection(tab: chrome.tabs.Tab) {
  if (!tab.url) return;
  
    // Check if we're on a meeting page
  if (tab.url) {
    const isMeeting = isMeetingUrl(tab.url);
    meetingDetected = isMeeting;
    
    if (isMeeting) {
      const platform = detectMeetingPlatform(tab.url);
      if (meetingPlatformEl) meetingPlatformEl.textContent = platform;
      if (meetingInfoEl) meetingInfoEl.classList.remove('hidden');
      updateStatus(`Detected ${platform} meeting`, 'success');
    } else {
      if (meetingInfoEl) meetingInfoEl.classList.add('hidden');
      updateStatus('No meeting detected on this page', 'info');
    }
    
    // Enable/disable record button based on meeting detection
    if (recordBtn) recordBtn.disabled = !isMeeting;
  }
}

async function checkRecordingStatus(tabId: number) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'GET_STATUS',
      tabId
    });
    
    if (response.isRecording) {
      isRecording = true;
      recordingStartTime = response.startTime || Date.now();
      startDurationTimer();
    }
    
    updateUI();
  } catch (error) {
    console.error('Error checking recording status:', error);
  }
}

function updateUI() {
  if (isRecording) {
    // Update UI for recording state
    if (recordBtn) recordBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (statusText) statusText.textContent = 'Recording in progress...';
  } else {
    // Update UI for idle state
    if (recordBtn) recordBtn.disabled = !meetingDetected;
    if (stopBtn) stopBtn.disabled = true;
    if (statusText) {
      statusText.textContent = meetingDetected ? 'Ready to record' : 'No meeting detected';
    }
  }
  
  // Update status dot
  if (statusDot) {
    statusDot.className = `status-dot ${isRecording ? 'recording' : 'idle'}`;
  }
  
  // Update status dot
  statusDot.classList.toggle('active', meetingDetected);
}

function updateStatus(message: string, type: StatusType = 'info') {
  // Early return if required elements are missing
  const elements = { statusText, statusDot };
  const missingElements = Object.entries(elements)
    .filter(([_, el]) => !el)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    console.error(`Missing required elements: ${missingElements.join(', ')}`);
    return;
  }

  // At this point, TypeScript knows these elements are not null
  statusText!.textContent = message;
  statusText!.className = `status-${type}`;
  statusDot!.className = `status-dot ${type}`;
  
  console.log(`[${type.toUpperCase()}] ${message}`);
}

function startDurationTimer() {
  if (!meetingDurationEl) {
    console.error('meetingDurationEl is not available');
    return;
  }

  recordingStartTime = Date.now();
  
  const updateDuration = () => {
    if (!recordingStartTime) return;
    
    const seconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    meetingDurationEl.textContent = `${hours.toString().padStart(2, '0')}:${
      minutes.toString().padStart(2, '0')}:${
      secs.toString().padStart(2, '0')}`;
  };
  
  // Update immediately and then every second
  updateDuration();
  durationInterval = setInterval(updateDuration, 1000);
}

function stopDurationTimer() {
  if (durationInterval) {
    clearInterval(durationInterval);
    durationInterval = null;
  }
}

// Meeting detection utilities are now imported from '../utils/meetingUtils'

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
