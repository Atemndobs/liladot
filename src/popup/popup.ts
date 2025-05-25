import { isMeetingUrl } from '../utils/meetingUtils';
import { 
  sendMessageToBackground, 
  type MessageSender,
  type RecordingStateResponse,
  MessageType,
  type MeetingInfo
} from '../utils/messaging';

type StatusType = 'success' | 'error' | 'warning' | 'info' | 'ready';

// State
let isRecording = false;
let meetingDetected = false;
let recordingStartTime: number | null = null;
let durationInterval: number | null = null;
let currentMeeting: MeetingInfo | null = null;
let currentTheme: 'light' | 'dark' = 'light';

// DOM Elements
const recordToggleBtn = document.getElementById('record-toggle-btn') as HTMLButtonElement | null;
const recordBtnText = document.getElementById('record-btn-text') as HTMLSpanElement | null;
const dashboardBtn = document.getElementById('dashboard-btn') as HTMLButtonElement | null;
const settingsBtn = document.getElementById('settings-btn') as HTMLButtonElement | null;
const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement | null;
const statusText = document.getElementById('status-text') as HTMLElement | null;
const statusDot = document.querySelector('.status-dot') as HTMLElement | null;
const meetingInfoEl = document.getElementById('meeting-info') as HTMLElement | null;
const meetingPlatformEl = document.getElementById('meeting-platform') as HTMLElement | null;
const meetingDurationEl = document.getElementById('meeting-duration') as HTMLElement | null;
const participantCountEl = document.getElementById('participant-count') as HTMLElement | null;

// Verify all required DOM elements are present
function verifyDomElements(): boolean {
  const requiredElements = [
    { name: 'recordToggleBtn', element: recordToggleBtn },
    { name: 'recordBtnText', element: recordBtnText },
    { name: 'dashboardBtn', element: dashboardBtn },
    { name: 'settingsBtn', element: settingsBtn },
    { name: 'themeToggleBtn', element: themeToggleBtn },
    { name: 'statusText', element: statusText },
    { name: 'statusDot', element: statusDot },
    { name: 'meetingInfoEl', element: meetingInfoEl },
    { name: 'meetingPlatformEl', element: meetingPlatformEl },
    { name: 'meetingDurationEl', element: meetingDurationEl },
    { name: 'participantCountEl', element: participantCountEl }
  ];

  const missingElements = requiredElements
    .filter(({ element }) => !element)
    .map(({ name }) => name);

  if (missingElements.length > 0) {
    console.error('Missing required DOM elements:', missingElements.join(', '));
    return false;
  }

  return true;
}

// Update status display
function updateStatus(message: string, type: StatusType = 'info'): void {
  if (!statusText || !statusDot) return;
  
  statusText.textContent = message;
  statusDot.className = 'status-dot';
  statusDot.classList.add(type);
  
  // Add a small visual feedback when status changes
  statusText.classList.add('status-update');
  setTimeout(() => {
    statusText?.classList.remove('status-update');
  }, 300);
}

// Start the duration timer
function startDurationTimer(): void {
  if (durationInterval) return;
  
  recordingStartTime = Date.now();
  
  const updateDuration = () => {
    if (!recordingStartTime || !meetingDurationEl) return;
    
    const seconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    meetingDurationEl.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  updateDuration();
  durationInterval = window.setInterval(updateDuration, 1000);
  
  // Update record button to show recording state
  if (recordToggleBtn && recordBtnText) {
    recordToggleBtn.classList.add('recording');
    recordToggleBtn.classList.add('btn-danger');
    recordToggleBtn.classList.remove('btn-primary');
    recordBtnText.textContent = 'Stop Recording';
  }
}

// Stop the duration timer
function stopDurationTimer(): void {
  if (!durationInterval) return;
  
  clearInterval(durationInterval);
  durationInterval = null;
  recordingStartTime = null;
  
  // Update record button to show idle state
  if (recordToggleBtn && recordBtnText) {
    recordToggleBtn.classList.remove('recording');
    recordToggleBtn.classList.remove('btn-danger');
    recordToggleBtn.classList.add('btn-primary');
    recordBtnText.textContent = 'Start Recording';
  }
}

// Handle start recording
async function handleStartRecording(): Promise<void> {
  if (!meetingDetected) {
    updateStatus('No meeting detected', 'error');
    return;
  }

  if (!recordToggleBtn || !recordBtnText) return;
  
  try {
    updateStatus('Starting recording...', 'info');
    
    // Add loading state to the button
    recordToggleBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Starting...';
    recordToggleBtn.disabled = true;
    
    const response = await sendMessageToBackground<null, RecordingStateResponse>({
      type: MessageType.START_RECORDING
    });
    
    if (response?.success) {
      isRecording = true;
      recordToggleBtn.disabled = false;
      updateStatus('Recording started', 'success');
      startDurationTimer();
      
      // Update button to show recording state
      recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Recording';
    } else {
      throw new Error(response?.error || 'Failed to start recording');
    }
  } catch (error) {
    console.error('Error starting recording:', error);
    updateStatus('Failed to start recording', 'error');
    
    // Reset button state on error
    if (recordToggleBtn) {
      recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Start Recording';
      recordToggleBtn.disabled = false;
    }
  }
}

// Handle stop recording
async function handleStopRecording(): Promise<void> {
  if (!recordToggleBtn || !isRecording) return;
  
  try {
    updateStatus('Stopping recording...', 'info');
    
    // Add loading state to the stop button
    recordToggleBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Stopping...';
    recordToggleBtn.disabled = true;
    
    const response = await sendMessageToBackground<null, RecordingStateResponse>({
      type: MessageType.STOP_RECORDING
    });
    
    if (response?.success) {
      isRecording = false;
      recordToggleBtn.disabled = false;
      updateStatus('Recording saved', 'success');
      stopDurationTimer();
      
      // Reset button states
      recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Start Recording';
    } else {
      throw new Error(response?.error || 'Failed to stop recording');
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
    updateStatus('Error stopping recording', 'error');
    
    // Reset button state on error
    if (recordToggleBtn) {
      recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Stop Recording';
      recordToggleBtn.disabled = false;
    }
  }
}

// Open the dashboard in a new tab
function openDashboard(): void {
  chrome.tabs.create({ url: 'https://app.liladot.com' });
}

// Set up event listeners
function setupEventListeners(): void {
  // Record toggle button
  recordToggleBtn?.addEventListener('click', async () => {
    try {
      if (isRecording) {
        await handleStopRecording();
      } else {
        await handleStartRecording();
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      updateStatus('Error toggling recording', 'error');
    }
  });
  
  // Dashboard button
  dashboardBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDashboard();
  });
  
  // Settings button
  settingsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Theme toggle button
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // Add ripple effect to buttons
  const buttons = [recordToggleBtn, dashboardBtn, settingsBtn, themeToggleBtn];
  buttons.forEach((btn) => {
    if (!btn) return;

    btn.addEventListener('mousedown', (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });
}

// Update meeting info display
function updateMeetingInfo(meeting: MeetingInfo): void {
  if (!meetingPlatformEl || !participantCountEl) return;
  
  currentMeeting = meeting;
  
  // Update platform
  meetingPlatformEl.textContent = meeting.platform || 'Unknown';
  
  // Update participant count
  const participantCount = meeting.participants?.length || 0;
  participantCountEl.textContent = participantCount > 0 ? 
    participantCount.toString() : 
    'None detected';
  
  // Show meeting info section
  if (meetingInfoEl) {
    meetingInfoEl.style.display = 'block';
  }
}

// Theme functions
function setTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;
  // Save to chrome.storage
  chrome.storage.local.set({ theme });
}

function toggleTheme(): void {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialize theme from storage
async function initTheme(): Promise<void> {
  try {
    const result = await chrome.storage.local.get('theme');
    const savedTheme = result.theme as 'light' | 'dark' | undefined;
    setTheme(savedTheme || 'light');
  } catch (error) {
    console.error('Error loading theme:', error);
    setTheme('light');
  }
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme
  await initTheme();

  // Add theme toggle event listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  } else {
    console.error('Theme toggle button not found');
  }

  // Verify DOM elements
  if (!verifyDomElements()) {
    updateStatus('Error: Missing required elements', 'error');
    return;
  }

  // Set up event listeners
  setupEventListeners();

  try {
    // Check current tab for meeting
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.url && isMeetingUrl(tab.url)) {
      meetingDetected = true;
      updateStatus('Meeting detected', 'success');

      // Get meeting info
      try {
        const meetingResponse = await sendMessageToBackground<null, { meeting: MeetingInfo }>({
          type: MessageType.GET_MEETING_INFO,
        });

        if (meetingResponse?.meeting) {
          updateMeetingInfo(meetingResponse.meeting);
        } else if (tab.title) {
          // Fallback to tab title if no meeting info is available
          updateMeetingInfo({
            platform: tab.title,
            meetingId: null,
            participants: [],
          });
        }
      } catch (error) {
        console.error('Error fetching meeting info:', error);
        if (tab.title) {
          updateMeetingInfo({
            platform: tab.title,
            meetingId: null,
            participants: [],
          });
        }
      }

      // Check recording state
      const recordingState = await sendMessageToBackground<null, RecordingStateResponse>({
        type: MessageType.GET_RECORDING_STATE,
      });

      if (recordingState?.isRecording) {
        isRecording = true;
        if (recordToggleBtn && recordBtnText) {
          recordToggleBtn.disabled = false;
          recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Stop Recording';
          recordBtnText.textContent = 'Stop Recording';
        }
        updateStatus('Recording in progress', 'success');
        startDurationTimer();
      }
    } else {
      updateStatus('No meeting detected', 'warning');
      if (meetingInfoEl) meetingInfoEl.style.display = 'none';
    }
  } catch (error) {
    console.error('Error initializing popup:', error);
    updateStatus('Error initializing', 'error');
  }
  
  // Listen for meeting updates
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.MEETING_DETECTED) {
      meetingDetected = true;
      updateStatus('Meeting detected', 'success');
      if (message.data) {
        updateMeetingInfo(message.data);
      }
    } else if (message.type === MessageType.PARTICIPANTS_UPDATED && message.data) {
      if (currentMeeting) {
        currentMeeting.participants = message.data.participants || [];
        if (participantCountEl) {
          participantCountEl.textContent = currentMeeting.participants.length > 0 ?
            currentMeeting.participants.length.toString() :
            'None detected';
        }
      }
    }
    return true; // Keep the message channel open for async response
  });
});
