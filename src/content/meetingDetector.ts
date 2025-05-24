// Detect meeting platforms and notify background script

interface MeetingInfo {
  platform: string;
  meetingId: string | null;
  participants: string[];
}

function detectMeeting(): MeetingInfo | null {
  const url = window.location.href;
  
  // Google Meet
  if (url.includes('meet.google.com')) {
    return {
      platform: 'Google Meet',
      meetingId: getGoogleMeetId(),
      participants: getGoogleMeetParticipants()
    };
  }
  
  // Zoom
  if (url.includes('zoom.us/j/')) {
    return {
      platform: 'Zoom',
      meetingId: getZoomMeetingId(),
      participants: getZoomParticipants()
    };
  }
  
  // Microsoft Teams
  if (url.includes('teams.microsoft.com')) {
    return {
      platform: 'Microsoft Teams',
      meetingId: getTeamsMeetingId(),
      participants: getTeamsParticipants()
    };
  }
  
  return null;
}

// Platform-specific detection functions
function getGoogleMeetId(): string | null {
  // Extract from URL: https://meet.google.com/xxx-yyyy-zzz
  const match = window.location.href.match(/meet\.google\.com\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

function getGoogleMeetParticipants(): string[] {
  // Implementation would use the Google Meet API or DOM scraping
  // This is a placeholder - actual implementation would need to be updated
  // based on Google Meet's DOM structure
  const participants: string[] = [];
  
  // Example: Scrape participant names from the DOM
  // Note: This is a simplified example and may not work with all versions of Google Meet
  document.querySelectorAll('[data-participant-id]').forEach(el => {
    const name = el.getAttribute('data-participant-name') || 'Unknown';
    if (name && name !== 'Unknown' && !participants.includes(name)) {
      participants.push(name);
    }
  });
  
  return participants;
}

function getZoomMeetingId(): string | null {
  // Extract from URL: https://zoom.us/j/1234567890
  const match = window.location.href.match(/zoom\.us\/j\/(\d+)/i);
  return match ? match[1] : null;
}

function getZoomParticipants(): string[] {
  // Implementation would use the Zoom SDK or DOM scraping
  // This is a placeholder
  const participants: string[] = [];
  
  // Example: Scrape participant names from the DOM
  // Note: This is a simplified example
  document.querySelectorAll('[aria-label^="Participant:"]').forEach(el => {
    const name = el.getAttribute('aria-label')?.replace('Participant: ', '');
    if (name && !participants.includes(name)) {
      participants.push(name);
    }
  });
  
  return participants;
}

function getTeamsMeetingId(): string | null {
  // Extract from URL: https://teams.microsoft.com/l/meetup-join/...
  const match = window.location.href.match(/meetup-join\/([^/]+)/i);
  return match ? match[1] : null;
}

function getTeamsParticipants(): string[] {
  // Implementation would use the Teams SDK or DOM scraping
  // This is a placeholder
  const participants: string[] = [];
  
  // Example: Scrape participant names from the DOM
  // Note: This is a simplified example
  document.querySelectorAll('[data-tid^="participant-avatar-"]').forEach(el => {
    const name = el.getAttribute('title') || el.getAttribute('aria-label') || '';
    if (name && !participants.includes(name)) {
      participants.push(name);
    }
  });
  
  return participants;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_RECORDING') {
    // Start recording logic here
    console.log('Starting recording with options:', request.options);
    
    // Notify background script that recording started
    chrome.runtime.sendMessage({
      type: 'RECORDING_STARTED',
      tabId: sender.tab?.id
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  if (request.action === 'STOP_RECORDING') {
    // Stop recording logic here
    console.log('Stopping recording');
    
    // Process and send transcription data
    const transcription = {
      text: 'Sample transcription text',
      segments: [
        { start: 0, end: 5000, text: 'Sample transcription segment' }
      ]
    };
    
    // Notify background script that recording stopped
    chrome.runtime.sendMessage({
      type: 'RECORDING_STOPPED',
      tabId: sender.tab?.id,
      transcription
    });
    
    return true;
  }
});

// Initial detection when content script loads
const meetingInfo = detectMeeting();
if (meetingInfo) {
  // Notify background script about the detected meeting
  chrome.runtime.sendMessage({
    type: 'MEETING_DETECTED',
    platform: meetingInfo.platform,
    meetingId: meetingInfo.meetingId,
    participants: meetingInfo.participants
  });
}

// Watch for URL changes to detect when user joins/leaves a meeting
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    const newMeetingInfo = detectMeeting();
    
    if (newMeetingInfo) {
      chrome.runtime.sendMessage({
        type: 'MEETING_DETECTED',
        platform: newMeetingInfo.platform,
        meetingId: newMeetingInfo.meetingId,
        participants: newMeetingInfo.participants
      });
    } else {
      chrome.runtime.sendMessage({
        type: 'MEETING_ENDED'
      });
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { subtree: true, childList: true });
