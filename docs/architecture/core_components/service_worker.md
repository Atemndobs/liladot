# Service Worker Architecture

## Overview
The service worker serves as the backbone of the LilaDot Chrome extension, managing background tasks, state, and communication between different parts of the extension.

## Key Responsibilities

### 1. Audio Processing
- Manages audio capture from browser tabs
- Handles audio stream processing and chunking
- Manages audio permissions and fallback mechanisms

### 2. State Management
- Maintains the application state
- Manages user preferences and settings
- Handles authentication state

### 3. Communication Hub
- Coordinates between popup, content scripts, and options UI
- Manages message passing between extension components
- Handles cross-origin communication when needed

### 4. Background Tasks
- Monitors meeting status (start/end detection)
- Manages transcription jobs
- Handles offline queuing of transcriptions

## Implementation Details

### Lifecycle
1. **Installation**: Sets up necessary event listeners and initial state
2. **Activation**: Cleans up old caches and prepares the worker
3. **Runtime**: Handles incoming messages and events
4. **Termination**: Cleans up resources when being terminated

### Message Types
- `START_RECORDING`: Initiate audio capture
- `STOP_RECORDING`: Stop audio capture and process recording
- `TRANSCRIPTION_UPDATE`: Send transcription updates to UI
- `MEETING_STATUS_CHANGE`: Notify about meeting state changes
- `STORAGE_UPDATE`: Synchronize state changes

### Error Handling
- Implements retry logic for failed operations
- Provides meaningful error messages to the UI
- Handles network connectivity issues gracefully

## Performance Considerations
- Minimizes memory footprint
- Implements efficient audio chunking strategy
- Uses web workers for CPU-intensive tasks

## Security
- Validates all incoming messages
- Implements proper CORS policies
- Handles sensitive data securely

## Dependencies
- Chrome Extension APIs
- Web Audio API
- IndexedDB for local storage
- (Optional) Cloud storage client
