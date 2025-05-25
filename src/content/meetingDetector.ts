import { MessageType } from '../utils/messaging';

// Detect meeting platforms and notify background script
interface MeetingInfo {
  platform: string;
  meetingId: string | null;
  participants: string[];
}

// Store the current meeting info
let currentMeeting: MeetingInfo | null = null;

function detectMeeting(): MeetingInfo | null {
  const url = window.location.href;

  // Google Meet
  if (url.includes('meet.google.com')) {
    return {
      platform: 'Google Meet',
      meetingId: getGoogleMeetId(),
      participants: getGoogleMeetParticipants(),
    };
  }

  // Zoom
  if (url.includes('zoom.us/j/')) {
    return {
      platform: 'Zoom',
      meetingId: getZoomMeetingId(),
      participants: getZoomParticipants(),
    };
  }

  // Microsoft Teams
  if (url.includes('teams.microsoft.com')) {
    return {
      platform: 'Microsoft Teams',
      meetingId: getTeamsMeetingId(),
      participants: getTeamsParticipants(),
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
  return [];
}

function getZoomMeetingId(): string | null {
  // Extract from URL: https://zoom.us/j/123456789
  const match = window.location.href.match(/zoom\.us\/j\/(\d+)/i);
  return match ? match[1] : null;
}

function getZoomParticipants(): string[] {
  // Implementation would use the Zoom API or DOM scraping
  // This is a placeholder - actual implementation would need to be updated
  return [];
}

function getTeamsMeetingId(): string | null {
  // Extract from URL: https://teams.microsoft.com/l/meetup-join/...
  const match = window.location.href.match(/meetup-join\/([^/]+)/i);
  return match ? match[1] : null;
}

function getTeamsParticipants(): string[] {
  // Implementation would use the Teams API or DOM scraping
  // This is a placeholder - actual implementation would need to be updated
  return [];
}

// Check if we're on a meeting page when the content script loads
function checkForMeeting() {
  const meeting = detectMeeting();
  if (meeting) {
    currentMeeting = meeting;
    chrome.runtime.sendMessage({
      type: 'MEETING_DETECTED',
      data: meeting
    });
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_RECORDING_STATE') {
    sendResponse({
      isMeeting: currentMeeting !== null,
      meeting: currentMeeting
    });
    return true; // Keep the message channel open for the response
  }
  
  if (message.type === 'START_RECORDING') {
    if (currentMeeting) {
      // Start recording logic here
      console.log('Starting recording for meeting:', currentMeeting);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'No meeting detected' });
    }
    return true;
  }
  
  if (message.type === 'STOP_RECORDING') {
    // Stop recording logic here
    console.log('Stopping recording');
    sendResponse({ success: true });
    return true;
  }
});

// Initial check when the content script loads
checkForMeeting();

// Also check when the URL changes
window.addEventListener('hashchange', checkForMeeting);
window.addEventListener('popstate', checkForMeeting);

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
        participants: newMeetingInfo.participants,
      });
    } else {
      chrome.runtime.sendMessage({
        type: 'MEETING_ENDED',
      });
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { subtree: true, childList: true });
