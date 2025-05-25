# Popup Component

## Overview
The popup component serves as the main user interface for the LilaDot extension, providing controls and feedback for meeting recording functionality.

## Key Responsibilities

### 1. User Interface
- Display meeting detection status
- Show recording controls (start/stop)
- Display recording duration
- Show number of participants (when available)
- Provide visual feedback for different states

### 2. State Management
- Track recording state (idle/recording/error)
- Manage meeting detection status
- Handle user preferences
- Maintain UI state (expanded/collapsed views)

### 3. Communication
- Send commands to service worker (start/stop recording)
- Receive updates from service worker
- Handle errors and display appropriate messages

## UI Components

### 1. Status Bar
- Meeting detection indicator (dot + status text)
- Recording duration timer
- Number of participants (when in a meeting)

### 2. Controls
- Record button (toggle)
- Stop button (when recording)
- Settings button
- Expand/collapse button

### 3. Meeting Information
- Meeting platform (Google Meet, Zoom, etc.)
- Meeting ID (when available)
- Recording status
- Last saved recording information

## State Management

### Local State
- `isRecording`: Boolean - Whether recording is in progress
- `meetingDetected`: Boolean - Whether a meeting is detected
- `recordingStartTime`: Timestamp - When recording started
- `participantCount`: Number - Number of participants in meeting
- `meetingPlatform`: String - Detected meeting platform
- `error`: String | null - Current error message, if any

### Communication with Service Worker
- **Outgoing Messages**:
  - `START_RECORDING`: Initiate recording
  - `STOP_RECORDING`: Stop recording
  - `GET_MEETING_STATUS`: Request current meeting status
  - `GET_RECORDING_STATUS`: Request current recording status

- **Incoming Messages**:
  - `RECORDING_STARTED`: Confirmation of recording start
  - `RECORDING_STOPPED`: Confirmation of recording stop
  - `MEETING_STATUS_UPDATE`: Update on meeting detection
  - `ERROR`: Error notification

## Error Handling
- Display user-friendly error messages
- Provide recovery options when possible
- Log errors for debugging
- Handle service worker disconnection

## Accessibility
- Keyboard navigation support
- ARIA labels for interactive elements
- High contrast mode support
- Screen reader compatibility

## Performance Considerations
- Minimize re-renders
- Lazy load non-critical components
- Optimize asset loading
- Implement proper cleanup on unmount

## Testing Requirements
- Unit tests for all components
- Integration tests for service worker communication
- Visual regression tests for UI components
- Cross-browser compatibility testing
