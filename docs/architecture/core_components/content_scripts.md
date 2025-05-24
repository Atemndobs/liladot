# Content Scripts Architecture

## Overview
Content scripts enable LilaDot to interact with web pages, specifically targeting meeting platforms like Google Meet, Zoom, and Microsoft Teams.

## Key Responsibilities

### 1. Meeting Detection
- Identifies when a meeting starts/ends on supported platforms
- Detects meeting metadata (participants, time, platform)
- Monitors meeting state changes

### 2. UI Integration
- Injects UI elements into meeting platforms
- Handles user interactions within the meeting context
- Provides visual feedback for recording status

### 3. Communication
- Relays meeting events to the service worker
- Receives and displays transcription updates
- Handles permission requests

## Implementation Details

### Supported Platforms
1. **Google Meet**
   - Detects meeting room URLs
   - Monitors participant list changes
   - Identifies host controls

2. **Zoom Web**
   - Detects meeting state
   - Monitors participant count
   - Identifies recording status

3. **Microsoft Teams**
   - Detects call/meeting state
   - Monitors participant list
   - Handles Teams-specific UI elements

### DOM Manipulation
- Uses shadow DOM for UI components
- Implements mutation observers for dynamic content
- Follows platform-specific styling guidelines

### Message Passing
- Uses `chrome.runtime.sendMessage` for communication
- Implements message validation
- Handles response callbacks

## Security Considerations
- Implements strict CSP policies
- Validates all injected content
- Follows least privilege principle
- Handles sensitive data securely

## Performance Optimization
- Debounces frequent events
- Uses efficient selectors
- Implements lazy loading for UI components
- Cleans up event listeners

## Error Handling
- Gracefully handles platform changes
- Recovers from injection failures
- Provides user feedback for errors

## Testing Strategy
- Unit tests for core functionality
- Integration tests with mock meeting platforms
- Cross-browser compatibility testing
- Performance benchmarking
