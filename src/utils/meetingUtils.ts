/**
 * Checks if the given URL matches any of the supported meeting platforms
 * @param url The URL to check
 * @returns boolean indicating if the URL is a supported meeting platform
 */
export function isMeetingUrl(url: string): boolean {
  const meetingPatterns = [
    /^https?:\/\/meet\.google\.com\//,
    /^https?:\/\/zoom\.us\/j\//,
    /^https?:\/\/teams\.microsoft\.com\/l\/meeting/,
    /^https?:\/\/teams\.microsoft\.com\/meeting/,
  ];
  return meetingPatterns.some(pattern => pattern.test(url));
}

/**
 * Detects the meeting platform based on the URL
 * @param url The URL to check
 * @returns The name of the detected meeting platform
 */
export function detectMeetingPlatform(url: string): string {
  if (url.includes('meet.google.com')) return 'Google Meet';
  if (url.includes('zoom.us')) return 'Zoom';
  if (url.includes('teams.microsoft.com')) return 'Microsoft Teams';
  return 'Unknown';
}

/**
 * Extracts meeting ID from URL if possible
 * @param url The meeting URL
 * @returns The meeting ID or null if not found
 */
export function extractMeetingId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Google Meet
    if (urlObj.hostname === 'meet.google.com') {
      return urlObj.pathname.split('/').pop() || null;
    }
    
    // Zoom
    if (urlObj.hostname === 'zoom.us' && urlObj.pathname.startsWith('/j/')) {
      return urlObj.pathname.split('/j/').pop() || null;
    }
    
    // Microsoft Teams
    if (urlObj.hostname.includes('teams.microsoft.com')) {
      const meetingIdMatch = url.match(/meetup-join\/([^/]+)/);
      return meetingIdMatch ? meetingIdMatch[1] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting meeting ID:', error);
    return null;
  }
}
