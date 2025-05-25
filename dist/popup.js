/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/meetingUtils.ts":
/*!***********************************!*\
  !*** ./src/utils/meetingUtils.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectMeetingPlatform: () => (/* binding */ detectMeetingPlatform),
/* harmony export */   extractMeetingId: () => (/* binding */ extractMeetingId),
/* harmony export */   isMeetingUrl: () => (/* binding */ isMeetingUrl)
/* harmony export */ });
/**
 * Checks if the given URL matches any of the supported meeting platforms
 * @param url The URL to check
 * @returns boolean indicating if the URL is a supported meeting platform
 */
function isMeetingUrl(url) {
    const meetingPatterns = [
        /^https?:\/\/meet\.google\.com\//,
        /^https?:\/\/zoom\.us\/j\//,
        /^https?:\/\/teams\.microsoft\.com\/l\/meeting/,
        /^https?:\/\/teams\.microsoft\.com\/meeting/,
    ];
    return meetingPatterns.some((pattern) => pattern.test(url));
}
/**
 * Detects the meeting platform based on the URL
 * @param url The URL to check
 * @returns The name of the detected meeting platform
 */
function detectMeetingPlatform(url) {
    if (url.includes('meet.google.com'))
        return 'Google Meet';
    if (url.includes('zoom.us'))
        return 'Zoom';
    if (url.includes('teams.microsoft.com'))
        return 'Microsoft Teams';
    return 'Unknown';
}
/**
 * Extracts meeting ID from URL if possible
 * @param url The meeting URL
 * @returns The meeting ID or null if not found
 */
function extractMeetingId(url) {
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
    }
    catch (error) {
        console.error('Error extracting meeting ID:', error);
        return null;
    }
}


/***/ }),

/***/ "./src/utils/messaging.ts":
/*!********************************!*\
  !*** ./src/utils/messaging.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageType: () => (/* binding */ MessageType),
/* harmony export */   addMessageListener: () => (/* binding */ addMessageListener),
/* harmony export */   isMessageType: () => (/* binding */ isMessageType),
/* harmony export */   sendMessageToBackground: () => (/* binding */ sendMessageToBackground),
/* harmony export */   sendMessageToTab: () => (/* binding */ sendMessageToTab)
/* harmony export */ });
/**
 * Messaging utilities for Chrome extension message passing
 * Handles communication between popup, content scripts, and background
 */
const MessageType = {
    START_RECORDING: 'START_RECORDING',
    STOP_RECORDING: 'STOP_RECORDING',
    RECORDING_STARTED: 'RECORDING_STARTED',
    RECORDING_STOPPED: 'RECORDING_STOPPED',
    MEETING_DETECTED: 'MEETING_DETECTED',
    MEETING_ENDED: 'MEETING_ENDED',
    GET_RECORDING_STATE: 'GET_RECORDING_STATE',
    GET_MEETING_INFO: 'GET_MEETING_INFO',
    PARTICIPANTS_UPDATED: 'PARTICIPANTS_UPDATED',
    ERROR: 'ERROR',
};
/**
 * Type guard to check if a value is a valid message type
 */
function isMessageType(value) {
    return Object.values(MessageType).includes(value);
}
function sendMessageToBackground(type, data) {
    // Handle both object-style and simple type + data style
    const messageObj = typeof type === 'object' ? type : { type, data };
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage(messageObj, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(response);
            });
        }
        catch (error) {
            console.error('Error sending message:', { type, error });
            reject(error);
        }
    });
}
/**
 * Send a message to a specific tab
 * @param tabId The ID of the tab to send the message to
 * @param type The message type
 * @param data Optional data to send with the message
 * @returns Promise that resolves with the response
 */
function sendMessageToTab(tabId, type, data) {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.sendMessage(tabId, { type, data }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(response);
            });
        }
        catch (error) {
            console.error('Error sending message to tab:', { tabId, type, error });
            reject(error);
        }
    });
}
/**
 * Add a message listener
 * @param handler Function to handle incoming messages
 * @returns Function to remove the listener
 */
function addMessageListener(handler) {
    const wrappedHandler = (message, sender, sendResponse) => {
        if (message &&
            typeof message === 'object' &&
            'type' in message &&
            isMessageType(message.type)) {
            const result = handler(message, sender, sendResponse);
            // Return true to indicate we want to send a response asynchronously
            if (result instanceof Promise) {
                result.then((shouldSendResponse) => {
                    if (shouldSendResponse !== false) {
                        sendResponse();
                    }
                });
                return true;
            }
            return result;
        }
    };
    chrome.runtime.onMessage.addListener(wrappedHandler);
    // Return a function to remove this listener
    return () => {
        chrome.runtime.onMessage.removeListener(wrappedHandler);
    };
}
// MessageSender is already exported above


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/popup/popup.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_meetingUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/meetingUtils */ "./src/utils/meetingUtils.ts");
/* harmony import */ var _utils_messaging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/messaging */ "./src/utils/messaging.ts");


// State
let isRecording = false;
let meetingDetected = false;
let recordingStartTime = null;
let durationInterval = null;
let currentMeeting = null;
let currentTheme = 'light';
// DOM Elements
const recordToggleBtn = document.getElementById('record-toggle-btn');
const recordBtnText = document.getElementById('record-btn-text');
const dashboardBtn = document.getElementById('dashboard-btn');
const settingsBtn = document.getElementById('settings-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');
const meetingInfoEl = document.getElementById('meeting-info');
const meetingPlatformEl = document.getElementById('meeting-platform');
const meetingDurationEl = document.getElementById('meeting-duration');
const participantCountEl = document.getElementById('participant-count');
// Verify all required DOM elements are present
function verifyDomElements() {
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
function updateStatus(message, type = 'info') {
    if (!statusText || !statusDot)
        return;
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
function startDurationTimer() {
    if (durationInterval)
        return;
    recordingStartTime = Date.now();
    const updateDuration = () => {
        if (!recordingStartTime || !meetingDurationEl)
            return;
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
function stopDurationTimer() {
    if (!durationInterval)
        return;
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
async function handleStartRecording() {
    if (!meetingDetected) {
        updateStatus('No meeting detected', 'error');
        return;
    }
    if (!recordToggleBtn || !recordBtnText)
        return;
    try {
        updateStatus('Starting recording...', 'info');
        // Add loading state to the button
        recordToggleBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Starting...';
        recordToggleBtn.disabled = true;
        const response = await (0,_utils_messaging__WEBPACK_IMPORTED_MODULE_1__.sendMessageToBackground)({
            type: _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.START_RECORDING
        });
        if (response?.success) {
            isRecording = true;
            recordToggleBtn.disabled = false;
            updateStatus('Recording started', 'success');
            startDurationTimer();
            // Update button to show recording state
            recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Recording';
        }
        else {
            throw new Error(response?.error || 'Failed to start recording');
        }
    }
    catch (error) {
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
async function handleStopRecording() {
    if (!recordToggleBtn || !isRecording)
        return;
    try {
        updateStatus('Stopping recording...', 'info');
        // Add loading state to the stop button
        recordToggleBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Stopping...';
        recordToggleBtn.disabled = true;
        const response = await (0,_utils_messaging__WEBPACK_IMPORTED_MODULE_1__.sendMessageToBackground)({
            type: _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.STOP_RECORDING
        });
        if (response?.success) {
            isRecording = false;
            recordToggleBtn.disabled = false;
            updateStatus('Recording saved', 'success');
            stopDurationTimer();
            // Reset button states
            recordToggleBtn.innerHTML = '<i class="fas fa-circle"></i> Start Recording';
        }
        else {
            throw new Error(response?.error || 'Failed to stop recording');
        }
    }
    catch (error) {
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
function openDashboard() {
    chrome.tabs.create({ url: 'https://app.liladot.com' });
}
// Set up event listeners
function setupEventListeners() {
    // Record toggle button
    recordToggleBtn?.addEventListener('click', async () => {
        try {
            if (isRecording) {
                await handleStopRecording();
            }
            else {
                await handleStartRecording();
            }
        }
        catch (error) {
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
        if (!btn)
            return;
        btn.addEventListener('mousedown', (e) => {
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
function updateMeetingInfo(meeting) {
    if (!meetingPlatformEl || !participantCountEl)
        return;
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
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    // Save to chrome.storage
    chrome.storage.local.set({ theme });
}
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}
// Initialize theme from storage
async function initTheme() {
    try {
        const result = await chrome.storage.local.get('theme');
        const savedTheme = result.theme;
        setTheme(savedTheme || 'light');
    }
    catch (error) {
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
    }
    else {
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
        if (tab?.url && (0,_utils_meetingUtils__WEBPACK_IMPORTED_MODULE_0__.isMeetingUrl)(tab.url)) {
            meetingDetected = true;
            updateStatus('Meeting detected', 'success');
            // Get meeting info
            try {
                const meetingResponse = await (0,_utils_messaging__WEBPACK_IMPORTED_MODULE_1__.sendMessageToBackground)({
                    type: _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.GET_MEETING_INFO,
                });
                if (meetingResponse?.meeting) {
                    updateMeetingInfo(meetingResponse.meeting);
                }
                else if (tab.title) {
                    // Fallback to tab title if no meeting info is available
                    updateMeetingInfo({
                        platform: tab.title,
                        meetingId: null,
                        participants: [],
                    });
                }
            }
            catch (error) {
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
            const recordingState = await (0,_utils_messaging__WEBPACK_IMPORTED_MODULE_1__.sendMessageToBackground)({
                type: _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.GET_RECORDING_STATE,
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
        }
        else {
            updateStatus('No meeting detected', 'warning');
            if (meetingInfoEl)
                meetingInfoEl.style.display = 'none';
        }
    }
    catch (error) {
        console.error('Error initializing popup:', error);
        updateStatus('Error initializing', 'error');
    }
    // Listen for meeting updates
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.MEETING_DETECTED) {
            meetingDetected = true;
            updateStatus('Meeting detected', 'success');
            if (message.data) {
                updateMeetingInfo(message.data);
            }
        }
        else if (message.type === _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.PARTICIPANTS_UPDATED && message.data) {
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLE9BQU87QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsbUNBQW1DO0FBQ25GLHdCQUF3QixpRUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4Qyx5RUFBdUI7QUFDckUsMEJBQTBCLHlEQUFXO0FBQ3JDLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHlDQUF5Qyx5RUFBdUI7QUFDaEUsc0JBQXNCLHlEQUFXO0FBQ2pDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHlEQUFXO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx5REFBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saWxhZG90Ly4vc3JjL3V0aWxzL21lZXRpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9saWxhZG90Ly4vc3JjL3V0aWxzL21lc3NhZ2luZy50cyIsIndlYnBhY2s6Ly9saWxhZG90L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xpbGFkb3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2xpbGFkb3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9saWxhZG90L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGlsYWRvdC8uL3NyYy9wb3B1cC9wb3B1cC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gVVJMIG1hdGNoZXMgYW55IG9mIHRoZSBzdXBwb3J0ZWQgbWVldGluZyBwbGF0Zm9ybXNcbiAqIEBwYXJhbSB1cmwgVGhlIFVSTCB0byBjaGVja1xuICogQHJldHVybnMgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBVUkwgaXMgYSBzdXBwb3J0ZWQgbWVldGluZyBwbGF0Zm9ybVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNNZWV0aW5nVXJsKHVybCkge1xuICAgIGNvbnN0IG1lZXRpbmdQYXR0ZXJucyA9IFtcbiAgICAgICAgL15odHRwcz86XFwvXFwvbWVldFxcLmdvb2dsZVxcLmNvbVxcLy8sXG4gICAgICAgIC9eaHR0cHM/OlxcL1xcL3pvb21cXC51c1xcL2pcXC8vLFxuICAgICAgICAvXmh0dHBzPzpcXC9cXC90ZWFtc1xcLm1pY3Jvc29mdFxcLmNvbVxcL2xcXC9tZWV0aW5nLyxcbiAgICAgICAgL15odHRwcz86XFwvXFwvdGVhbXNcXC5taWNyb3NvZnRcXC5jb21cXC9tZWV0aW5nLyxcbiAgICBdO1xuICAgIHJldHVybiBtZWV0aW5nUGF0dGVybnMuc29tZSgocGF0dGVybikgPT4gcGF0dGVybi50ZXN0KHVybCkpO1xufVxuLyoqXG4gKiBEZXRlY3RzIHRoZSBtZWV0aW5nIHBsYXRmb3JtIGJhc2VkIG9uIHRoZSBVUkxcbiAqIEBwYXJhbSB1cmwgVGhlIFVSTCB0byBjaGVja1xuICogQHJldHVybnMgVGhlIG5hbWUgb2YgdGhlIGRldGVjdGVkIG1lZXRpbmcgcGxhdGZvcm1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdE1lZXRpbmdQbGF0Zm9ybSh1cmwpIHtcbiAgICBpZiAodXJsLmluY2x1ZGVzKCdtZWV0Lmdvb2dsZS5jb20nKSlcbiAgICAgICAgcmV0dXJuICdHb29nbGUgTWVldCc7XG4gICAgaWYgKHVybC5pbmNsdWRlcygnem9vbS51cycpKVxuICAgICAgICByZXR1cm4gJ1pvb20nO1xuICAgIGlmICh1cmwuaW5jbHVkZXMoJ3RlYW1zLm1pY3Jvc29mdC5jb20nKSlcbiAgICAgICAgcmV0dXJuICdNaWNyb3NvZnQgVGVhbXMnO1xuICAgIHJldHVybiAnVW5rbm93bic7XG59XG4vKipcbiAqIEV4dHJhY3RzIG1lZXRpbmcgSUQgZnJvbSBVUkwgaWYgcG9zc2libGVcbiAqIEBwYXJhbSB1cmwgVGhlIG1lZXRpbmcgVVJMXG4gKiBAcmV0dXJucyBUaGUgbWVldGluZyBJRCBvciBudWxsIGlmIG5vdCBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdE1lZXRpbmdJZCh1cmwpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKHVybCk7XG4gICAgICAgIC8vIEdvb2dsZSBNZWV0XG4gICAgICAgIGlmICh1cmxPYmouaG9zdG5hbWUgPT09ICdtZWV0Lmdvb2dsZS5jb20nKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsT2JqLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBab29tXG4gICAgICAgIGlmICh1cmxPYmouaG9zdG5hbWUgPT09ICd6b29tLnVzJyAmJiB1cmxPYmoucGF0aG5hbWUuc3RhcnRzV2l0aCgnL2ovJykpIHtcbiAgICAgICAgICAgIHJldHVybiB1cmxPYmoucGF0aG5hbWUuc3BsaXQoJy9qLycpLnBvcCgpIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWljcm9zb2Z0IFRlYW1zXG4gICAgICAgIGlmICh1cmxPYmouaG9zdG5hbWUuaW5jbHVkZXMoJ3RlYW1zLm1pY3Jvc29mdC5jb20nKSkge1xuICAgICAgICAgICAgY29uc3QgbWVldGluZ0lkTWF0Y2ggPSB1cmwubWF0Y2goL21lZXR1cC1qb2luXFwvKFteL10rKS8pO1xuICAgICAgICAgICAgcmV0dXJuIG1lZXRpbmdJZE1hdGNoID8gbWVldGluZ0lkTWF0Y2hbMV0gOiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXh0cmFjdGluZyBtZWV0aW5nIElEOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBNZXNzYWdpbmcgdXRpbGl0aWVzIGZvciBDaHJvbWUgZXh0ZW5zaW9uIG1lc3NhZ2UgcGFzc2luZ1xuICogSGFuZGxlcyBjb21tdW5pY2F0aW9uIGJldHdlZW4gcG9wdXAsIGNvbnRlbnQgc2NyaXB0cywgYW5kIGJhY2tncm91bmRcbiAqL1xuZXhwb3J0IGNvbnN0IE1lc3NhZ2VUeXBlID0ge1xuICAgIFNUQVJUX1JFQ09SRElORzogJ1NUQVJUX1JFQ09SRElORycsXG4gICAgU1RPUF9SRUNPUkRJTkc6ICdTVE9QX1JFQ09SRElORycsXG4gICAgUkVDT1JESU5HX1NUQVJURUQ6ICdSRUNPUkRJTkdfU1RBUlRFRCcsXG4gICAgUkVDT1JESU5HX1NUT1BQRUQ6ICdSRUNPUkRJTkdfU1RPUFBFRCcsXG4gICAgTUVFVElOR19ERVRFQ1RFRDogJ01FRVRJTkdfREVURUNURUQnLFxuICAgIE1FRVRJTkdfRU5ERUQ6ICdNRUVUSU5HX0VOREVEJyxcbiAgICBHRVRfUkVDT1JESU5HX1NUQVRFOiAnR0VUX1JFQ09SRElOR19TVEFURScsXG4gICAgR0VUX01FRVRJTkdfSU5GTzogJ0dFVF9NRUVUSU5HX0lORk8nLFxuICAgIFBBUlRJQ0lQQU5UU19VUERBVEVEOiAnUEFSVElDSVBBTlRTX1VQREFURUQnLFxuICAgIEVSUk9SOiAnRVJST1InLFxufTtcbi8qKlxuICogVHlwZSBndWFyZCB0byBjaGVjayBpZiBhIHZhbHVlIGlzIGEgdmFsaWQgbWVzc2FnZSB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01lc3NhZ2VUeXBlKHZhbHVlKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoTWVzc2FnZVR5cGUpLmluY2x1ZGVzKHZhbHVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZW5kTWVzc2FnZVRvQmFja2dyb3VuZCh0eXBlLCBkYXRhKSB7XG4gICAgLy8gSGFuZGxlIGJvdGggb2JqZWN0LXN0eWxlIGFuZCBzaW1wbGUgdHlwZSArIGRhdGEgc3R5bGVcbiAgICBjb25zdCBtZXNzYWdlT2JqID0gdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnID8gdHlwZSA6IHsgdHlwZSwgZGF0YSB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlT2JqLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2VuZGluZyBtZXNzYWdlOicsIHsgdHlwZSwgZXJyb3IgfSk7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIFNlbmQgYSBtZXNzYWdlIHRvIGEgc3BlY2lmaWMgdGFiXG4gKiBAcGFyYW0gdGFiSWQgVGhlIElEIG9mIHRoZSB0YWIgdG8gc2VuZCB0aGUgbWVzc2FnZSB0b1xuICogQHBhcmFtIHR5cGUgVGhlIG1lc3NhZ2UgdHlwZVxuICogQHBhcmFtIGRhdGEgT3B0aW9uYWwgZGF0YSB0byBzZW5kIHdpdGggdGhlIG1lc3NhZ2VcbiAqIEByZXR1cm5zIFByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXNwb25zZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZE1lc3NhZ2VUb1RhYih0YWJJZCwgdHlwZSwgZGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgeyB0eXBlLCBkYXRhIH0sIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2UgdG8gdGFiOicsIHsgdGFiSWQsIHR5cGUsIGVycm9yIH0pO1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyoqXG4gKiBBZGQgYSBtZXNzYWdlIGxpc3RlbmVyXG4gKiBAcGFyYW0gaGFuZGxlciBGdW5jdGlvbiB0byBoYW5kbGUgaW5jb21pbmcgbWVzc2FnZXNcbiAqIEByZXR1cm5zIEZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZE1lc3NhZ2VMaXN0ZW5lcihoYW5kbGVyKSB7XG4gICAgY29uc3Qgd3JhcHBlZEhhbmRsZXIgPSAobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKG1lc3NhZ2UgJiZcbiAgICAgICAgICAgIHR5cGVvZiBtZXNzYWdlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgJ3R5cGUnIGluIG1lc3NhZ2UgJiZcbiAgICAgICAgICAgIGlzTWVzc2FnZVR5cGUobWVzc2FnZS50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaGFuZGxlcihtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSB3ZSB3YW50IHRvIHNlbmQgYSByZXNwb25zZSBhc3luY2hyb25vdXNseVxuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQudGhlbigoc2hvdWxkU2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG91bGRTZW5kUmVzcG9uc2UgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKHdyYXBwZWRIYW5kbGVyKTtcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB0byByZW1vdmUgdGhpcyBsaXN0ZW5lclxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcih3cmFwcGVkSGFuZGxlcik7XG4gICAgfTtcbn1cbi8vIE1lc3NhZ2VTZW5kZXIgaXMgYWxyZWFkeSBleHBvcnRlZCBhYm92ZVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBpc01lZXRpbmdVcmwgfSBmcm9tICcuLi91dGlscy9tZWV0aW5nVXRpbHMnO1xuaW1wb3J0IHsgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi4vdXRpbHMvbWVzc2FnaW5nJztcbi8vIFN0YXRlXG5sZXQgaXNSZWNvcmRpbmcgPSBmYWxzZTtcbmxldCBtZWV0aW5nRGV0ZWN0ZWQgPSBmYWxzZTtcbmxldCByZWNvcmRpbmdTdGFydFRpbWUgPSBudWxsO1xubGV0IGR1cmF0aW9uSW50ZXJ2YWwgPSBudWxsO1xubGV0IGN1cnJlbnRNZWV0aW5nID0gbnVsbDtcbmxldCBjdXJyZW50VGhlbWUgPSAnbGlnaHQnO1xuLy8gRE9NIEVsZW1lbnRzXG5jb25zdCByZWNvcmRUb2dnbGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjb3JkLXRvZ2dsZS1idG4nKTtcbmNvbnN0IHJlY29yZEJ0blRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVjb3JkLWJ0bi10ZXh0Jyk7XG5jb25zdCBkYXNoYm9hcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaGJvYXJkLWJ0bicpO1xuY29uc3Qgc2V0dGluZ3NCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2V0dGluZ3MtYnRuJyk7XG5jb25zdCB0aGVtZVRvZ2dsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVtZS10b2dnbGUnKTtcbmNvbnN0IHN0YXR1c1RleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzLXRleHQnKTtcbmNvbnN0IHN0YXR1c0RvdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0dXMtZG90Jyk7XG5jb25zdCBtZWV0aW5nSW5mb0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZXRpbmctaW5mbycpO1xuY29uc3QgbWVldGluZ1BsYXRmb3JtRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVldGluZy1wbGF0Zm9ybScpO1xuY29uc3QgbWVldGluZ0R1cmF0aW9uRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVldGluZy1kdXJhdGlvbicpO1xuY29uc3QgcGFydGljaXBhbnRDb3VudEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcnRpY2lwYW50LWNvdW50Jyk7XG4vLyBWZXJpZnkgYWxsIHJlcXVpcmVkIERPTSBlbGVtZW50cyBhcmUgcHJlc2VudFxuZnVuY3Rpb24gdmVyaWZ5RG9tRWxlbWVudHMoKSB7XG4gICAgY29uc3QgcmVxdWlyZWRFbGVtZW50cyA9IFtcbiAgICAgICAgeyBuYW1lOiAncmVjb3JkVG9nZ2xlQnRuJywgZWxlbWVudDogcmVjb3JkVG9nZ2xlQnRuIH0sXG4gICAgICAgIHsgbmFtZTogJ3JlY29yZEJ0blRleHQnLCBlbGVtZW50OiByZWNvcmRCdG5UZXh0IH0sXG4gICAgICAgIHsgbmFtZTogJ2Rhc2hib2FyZEJ0bicsIGVsZW1lbnQ6IGRhc2hib2FyZEJ0biB9LFxuICAgICAgICB7IG5hbWU6ICdzZXR0aW5nc0J0bicsIGVsZW1lbnQ6IHNldHRpbmdzQnRuIH0sXG4gICAgICAgIHsgbmFtZTogJ3RoZW1lVG9nZ2xlQnRuJywgZWxlbWVudDogdGhlbWVUb2dnbGVCdG4gfSxcbiAgICAgICAgeyBuYW1lOiAnc3RhdHVzVGV4dCcsIGVsZW1lbnQ6IHN0YXR1c1RleHQgfSxcbiAgICAgICAgeyBuYW1lOiAnc3RhdHVzRG90JywgZWxlbWVudDogc3RhdHVzRG90IH0sXG4gICAgICAgIHsgbmFtZTogJ21lZXRpbmdJbmZvRWwnLCBlbGVtZW50OiBtZWV0aW5nSW5mb0VsIH0sXG4gICAgICAgIHsgbmFtZTogJ21lZXRpbmdQbGF0Zm9ybUVsJywgZWxlbWVudDogbWVldGluZ1BsYXRmb3JtRWwgfSxcbiAgICAgICAgeyBuYW1lOiAnbWVldGluZ0R1cmF0aW9uRWwnLCBlbGVtZW50OiBtZWV0aW5nRHVyYXRpb25FbCB9LFxuICAgICAgICB7IG5hbWU6ICdwYXJ0aWNpcGFudENvdW50RWwnLCBlbGVtZW50OiBwYXJ0aWNpcGFudENvdW50RWwgfVxuICAgIF07XG4gICAgY29uc3QgbWlzc2luZ0VsZW1lbnRzID0gcmVxdWlyZWRFbGVtZW50c1xuICAgICAgICAuZmlsdGVyKCh7IGVsZW1lbnQgfSkgPT4gIWVsZW1lbnQpXG4gICAgICAgIC5tYXAoKHsgbmFtZSB9KSA9PiBuYW1lKTtcbiAgICBpZiAobWlzc2luZ0VsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyByZXF1aXJlZCBET00gZWxlbWVudHM6JywgbWlzc2luZ0VsZW1lbnRzLmpvaW4oJywgJykpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuLy8gVXBkYXRlIHN0YXR1cyBkaXNwbGF5XG5mdW5jdGlvbiB1cGRhdGVTdGF0dXMobWVzc2FnZSwgdHlwZSA9ICdpbmZvJykge1xuICAgIGlmICghc3RhdHVzVGV4dCB8fCAhc3RhdHVzRG90KVxuICAgICAgICByZXR1cm47XG4gICAgc3RhdHVzVGV4dC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgc3RhdHVzRG90LmNsYXNzTmFtZSA9ICdzdGF0dXMtZG90JztcbiAgICBzdGF0dXNEb3QuY2xhc3NMaXN0LmFkZCh0eXBlKTtcbiAgICAvLyBBZGQgYSBzbWFsbCB2aXN1YWwgZmVlZGJhY2sgd2hlbiBzdGF0dXMgY2hhbmdlc1xuICAgIHN0YXR1c1RleHQuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLXVwZGF0ZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzdGF0dXNUZXh0Py5jbGFzc0xpc3QucmVtb3ZlKCdzdGF0dXMtdXBkYXRlJyk7XG4gICAgfSwgMzAwKTtcbn1cbi8vIFN0YXJ0IHRoZSBkdXJhdGlvbiB0aW1lclxuZnVuY3Rpb24gc3RhcnREdXJhdGlvblRpbWVyKCkge1xuICAgIGlmIChkdXJhdGlvbkludGVydmFsKVxuICAgICAgICByZXR1cm47XG4gICAgcmVjb3JkaW5nU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB1cGRhdGVEdXJhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFyZWNvcmRpbmdTdGFydFRpbWUgfHwgIW1lZXRpbmdEdXJhdGlvbkVsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHJlY29yZGluZ1N0YXJ0VGltZSkgLyAxMDAwKTtcbiAgICAgICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyAzNjAwKTtcbiAgICAgICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoKHNlY29uZHMgJSAzNjAwKSAvIDYwKTtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nU2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcbiAgICAgICAgbWVldGluZ0R1cmF0aW9uRWwudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgYCR7aG91cnMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfToke21pbnV0ZXMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfToke3JlbWFpbmluZ1NlY29uZHMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpfWA7XG4gICAgfTtcbiAgICB1cGRhdGVEdXJhdGlvbigpO1xuICAgIGR1cmF0aW9uSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodXBkYXRlRHVyYXRpb24sIDEwMDApO1xuICAgIC8vIFVwZGF0ZSByZWNvcmQgYnV0dG9uIHRvIHNob3cgcmVjb3JkaW5nIHN0YXRlXG4gICAgaWYgKHJlY29yZFRvZ2dsZUJ0biAmJiByZWNvcmRCdG5UZXh0KSB7XG4gICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5jbGFzc0xpc3QuYWRkKCdyZWNvcmRpbmcnKTtcbiAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi1kYW5nZXInKTtcbiAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1wcmltYXJ5Jyk7XG4gICAgICAgIHJlY29yZEJ0blRleHQudGV4dENvbnRlbnQgPSAnU3RvcCBSZWNvcmRpbmcnO1xuICAgIH1cbn1cbi8vIFN0b3AgdGhlIGR1cmF0aW9uIHRpbWVyXG5mdW5jdGlvbiBzdG9wRHVyYXRpb25UaW1lcigpIHtcbiAgICBpZiAoIWR1cmF0aW9uSW50ZXJ2YWwpXG4gICAgICAgIHJldHVybjtcbiAgICBjbGVhckludGVydmFsKGR1cmF0aW9uSW50ZXJ2YWwpO1xuICAgIGR1cmF0aW9uSW50ZXJ2YWwgPSBudWxsO1xuICAgIHJlY29yZGluZ1N0YXJ0VGltZSA9IG51bGw7XG4gICAgLy8gVXBkYXRlIHJlY29yZCBidXR0b24gdG8gc2hvdyBpZGxlIHN0YXRlXG4gICAgaWYgKHJlY29yZFRvZ2dsZUJ0biAmJiByZWNvcmRCdG5UZXh0KSB7XG4gICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdyZWNvcmRpbmcnKTtcbiAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi1kYW5nZXInKTtcbiAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi1wcmltYXJ5Jyk7XG4gICAgICAgIHJlY29yZEJ0blRleHQudGV4dENvbnRlbnQgPSAnU3RhcnQgUmVjb3JkaW5nJztcbiAgICB9XG59XG4vLyBIYW5kbGUgc3RhcnQgcmVjb3JkaW5nXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTdGFydFJlY29yZGluZygpIHtcbiAgICBpZiAoIW1lZXRpbmdEZXRlY3RlZCkge1xuICAgICAgICB1cGRhdGVTdGF0dXMoJ05vIG1lZXRpbmcgZGV0ZWN0ZWQnLCAnZXJyb3InKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXJlY29yZFRvZ2dsZUJ0biB8fCAhcmVjb3JkQnRuVGV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZVN0YXR1cygnU3RhcnRpbmcgcmVjb3JkaW5nLi4uJywgJ2luZm8nKTtcbiAgICAgICAgLy8gQWRkIGxvYWRpbmcgc3RhdGUgdG8gdGhlIGJ1dHRvblxuICAgICAgICByZWNvcmRUb2dnbGVCdG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNpcmNsZS1ub3RjaCBmYS1zcGluXCI+PC9pPiBTdGFydGluZy4uLic7XG4gICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoe1xuICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGUuU1RBUlRfUkVDT1JESU5HXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdXBkYXRlU3RhdHVzKCdSZWNvcmRpbmcgc3RhcnRlZCcsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICBzdGFydER1cmF0aW9uVGltZXIoKTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBidXR0b24gdG8gc2hvdyByZWNvcmRpbmcgc3RhdGVcbiAgICAgICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5pbm5lckhUTUwgPSAnPGkgY2xhc3M9XCJmYXMgZmEtY2lyY2xlXCI+PC9pPiBSZWNvcmRpbmcnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlPy5lcnJvciB8fCAnRmFpbGVkIHRvIHN0YXJ0IHJlY29yZGluZycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzdGFydGluZyByZWNvcmRpbmc6JywgZXJyb3IpO1xuICAgICAgICB1cGRhdGVTdGF0dXMoJ0ZhaWxlZCB0byBzdGFydCByZWNvcmRpbmcnLCAnZXJyb3InKTtcbiAgICAgICAgLy8gUmVzZXQgYnV0dG9uIHN0YXRlIG9uIGVycm9yXG4gICAgICAgIGlmIChyZWNvcmRUb2dnbGVCdG4pIHtcbiAgICAgICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5pbm5lckhUTUwgPSAnPGkgY2xhc3M9XCJmYXMgZmEtY2lyY2xlXCI+PC9pPiBTdGFydCBSZWNvcmRpbmcnO1xuICAgICAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyBIYW5kbGUgc3RvcCByZWNvcmRpbmdcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN0b3BSZWNvcmRpbmcoKSB7XG4gICAgaWYgKCFyZWNvcmRUb2dnbGVCdG4gfHwgIWlzUmVjb3JkaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlU3RhdHVzKCdTdG9wcGluZyByZWNvcmRpbmcuLi4nLCAnaW5mbycpO1xuICAgICAgICAvLyBBZGQgbG9hZGluZyBzdGF0ZSB0byB0aGUgc3RvcCBidXR0b25cbiAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1jaXJjbGUtbm90Y2ggZmEtc3BpblwiPjwvaT4gU3RvcHBpbmcuLi4nO1xuICAgICAgICByZWNvcmRUb2dnbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKHtcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLlNUT1BfUkVDT1JESU5HXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZWNvcmRUb2dnbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHVwZGF0ZVN0YXR1cygnUmVjb3JkaW5nIHNhdmVkJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIHN0b3BEdXJhdGlvblRpbWVyKCk7XG4gICAgICAgICAgICAvLyBSZXNldCBidXR0b24gc3RhdGVzXG4gICAgICAgICAgICByZWNvcmRUb2dnbGVCdG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNpcmNsZVwiPjwvaT4gU3RhcnQgUmVjb3JkaW5nJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZT8uZXJyb3IgfHwgJ0ZhaWxlZCB0byBzdG9wIHJlY29yZGluZycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzdG9wcGluZyByZWNvcmRpbmc6JywgZXJyb3IpO1xuICAgICAgICB1cGRhdGVTdGF0dXMoJ0Vycm9yIHN0b3BwaW5nIHJlY29yZGluZycsICdlcnJvcicpO1xuICAgICAgICAvLyBSZXNldCBidXR0b24gc3RhdGUgb24gZXJyb3JcbiAgICAgICAgaWYgKHJlY29yZFRvZ2dsZUJ0bikge1xuICAgICAgICAgICAgcmVjb3JkVG9nZ2xlQnRuLmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1jaXJjbGVcIj48L2k+IFN0b3AgUmVjb3JkaW5nJztcbiAgICAgICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8gT3BlbiB0aGUgZGFzaGJvYXJkIGluIGEgbmV3IHRhYlxuZnVuY3Rpb24gb3BlbkRhc2hib2FyZCgpIHtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6ICdodHRwczovL2FwcC5saWxhZG90LmNvbScgfSk7XG59XG4vLyBTZXQgdXAgZXZlbnQgbGlzdGVuZXJzXG5mdW5jdGlvbiBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIC8vIFJlY29yZCB0b2dnbGUgYnV0dG9uXG4gICAgcmVjb3JkVG9nZ2xlQnRuPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChpc1JlY29yZGluZykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGhhbmRsZVN0b3BSZWNvcmRpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF3YWl0IGhhbmRsZVN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB0b2dnbGluZyByZWNvcmRpbmc6JywgZXJyb3IpO1xuICAgICAgICAgICAgdXBkYXRlU3RhdHVzKCdFcnJvciB0b2dnbGluZyByZWNvcmRpbmcnLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIERhc2hib2FyZCBidXR0b25cbiAgICBkYXNoYm9hcmRCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvcGVuRGFzaGJvYXJkKCk7XG4gICAgfSk7XG4gICAgLy8gU2V0dGluZ3MgYnV0dG9uXG4gICAgc2V0dGluZ3NCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgICB9KTtcbiAgICAvLyBUaGVtZSB0b2dnbGUgYnV0dG9uXG4gICAgdGhlbWVUb2dnbGVCdG4/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlVGhlbWUpO1xuICAgIC8vIEFkZCByaXBwbGUgZWZmZWN0IHRvIGJ1dHRvbnNcbiAgICBjb25zdCBidXR0b25zID0gW3JlY29yZFRvZ2dsZUJ0biwgZGFzaGJvYXJkQnRuLCBzZXR0aW5nc0J0biwgdGhlbWVUb2dnbGVCdG5dO1xuICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgIGlmICghYnRuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBidG4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICAgICAgY29uc3QgeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICAgICAgY29uc3QgcmlwcGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ3JpcHBsZScpO1xuICAgICAgICAgICAgcmlwcGxlLnN0eWxlLmxlZnQgPSBgJHt4fXB4YDtcbiAgICAgICAgICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHt5fXB4YDtcbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChyaXBwbGUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmlwcGxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gVXBkYXRlIG1lZXRpbmcgaW5mbyBkaXNwbGF5XG5mdW5jdGlvbiB1cGRhdGVNZWV0aW5nSW5mbyhtZWV0aW5nKSB7XG4gICAgaWYgKCFtZWV0aW5nUGxhdGZvcm1FbCB8fCAhcGFydGljaXBhbnRDb3VudEVsKVxuICAgICAgICByZXR1cm47XG4gICAgY3VycmVudE1lZXRpbmcgPSBtZWV0aW5nO1xuICAgIC8vIFVwZGF0ZSBwbGF0Zm9ybVxuICAgIG1lZXRpbmdQbGF0Zm9ybUVsLnRleHRDb250ZW50ID0gbWVldGluZy5wbGF0Zm9ybSB8fCAnVW5rbm93bic7XG4gICAgLy8gVXBkYXRlIHBhcnRpY2lwYW50IGNvdW50XG4gICAgY29uc3QgcGFydGljaXBhbnRDb3VudCA9IG1lZXRpbmcucGFydGljaXBhbnRzPy5sZW5ndGggfHwgMDtcbiAgICBwYXJ0aWNpcGFudENvdW50RWwudGV4dENvbnRlbnQgPSBwYXJ0aWNpcGFudENvdW50ID4gMCA/XG4gICAgICAgIHBhcnRpY2lwYW50Q291bnQudG9TdHJpbmcoKSA6XG4gICAgICAgICdOb25lIGRldGVjdGVkJztcbiAgICAvLyBTaG93IG1lZXRpbmcgaW5mbyBzZWN0aW9uXG4gICAgaWYgKG1lZXRpbmdJbmZvRWwpIHtcbiAgICAgICAgbWVldGluZ0luZm9FbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG59XG4vLyBUaGVtZSBmdW5jdGlvbnNcbmZ1bmN0aW9uIHNldFRoZW1lKHRoZW1lKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsIHRoZW1lKTtcbiAgICBjdXJyZW50VGhlbWUgPSB0aGVtZTtcbiAgICAvLyBTYXZlIHRvIGNocm9tZS5zdG9yYWdlXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdGhlbWUgfSk7XG59XG5mdW5jdGlvbiB0b2dnbGVUaGVtZSgpIHtcbiAgICBjb25zdCBuZXdUaGVtZSA9IGN1cnJlbnRUaGVtZSA9PT0gJ2xpZ2h0JyA/ICdkYXJrJyA6ICdsaWdodCc7XG4gICAgc2V0VGhlbWUobmV3VGhlbWUpO1xufVxuLy8gSW5pdGlhbGl6ZSB0aGVtZSBmcm9tIHN0b3JhZ2VcbmFzeW5jIGZ1bmN0aW9uIGluaXRUaGVtZSgpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3RoZW1lJyk7XG4gICAgICAgIGNvbnN0IHNhdmVkVGhlbWUgPSByZXN1bHQudGhlbWU7XG4gICAgICAgIHNldFRoZW1lKHNhdmVkVGhlbWUgfHwgJ2xpZ2h0Jyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIHRoZW1lOicsIGVycm9yKTtcbiAgICAgICAgc2V0VGhlbWUoJ2xpZ2h0Jyk7XG4gICAgfVxufVxuLy8gSW5pdGlhbGl6ZSB0aGUgcG9wdXBcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGVtZVxuICAgIGF3YWl0IGluaXRUaGVtZSgpO1xuICAgIC8vIEFkZCB0aGVtZSB0b2dnbGUgZXZlbnQgbGlzdGVuZXJcbiAgICBpZiAodGhlbWVUb2dnbGVCdG4pIHtcbiAgICAgICAgdGhlbWVUb2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVUaGVtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUaGVtZSB0b2dnbGUgYnV0dG9uIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICAvLyBWZXJpZnkgRE9NIGVsZW1lbnRzXG4gICAgaWYgKCF2ZXJpZnlEb21FbGVtZW50cygpKSB7XG4gICAgICAgIHVwZGF0ZVN0YXR1cygnRXJyb3I6IE1pc3NpbmcgcmVxdWlyZWQgZWxlbWVudHMnLCAnZXJyb3InKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBTZXQgdXAgZXZlbnQgbGlzdGVuZXJzXG4gICAgc2V0dXBFdmVudExpc3RlbmVycygpO1xuICAgIHRyeSB7XG4gICAgICAgIC8vIENoZWNrIGN1cnJlbnQgdGFiIGZvciBtZWV0aW5nXG4gICAgICAgIGNvbnN0IFt0YWJdID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoeyBhY3RpdmU6IHRydWUsIGN1cnJlbnRXaW5kb3c6IHRydWUgfSk7XG4gICAgICAgIGlmICh0YWI/LnVybCAmJiBpc01lZXRpbmdVcmwodGFiLnVybCkpIHtcbiAgICAgICAgICAgIG1lZXRpbmdEZXRlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB1cGRhdGVTdGF0dXMoJ01lZXRpbmcgZGV0ZWN0ZWQnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgLy8gR2V0IG1lZXRpbmcgaW5mb1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZWV0aW5nUmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZVRvQmFja2dyb3VuZCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkdFVF9NRUVUSU5HX0lORk8sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1lZXRpbmdSZXNwb25zZT8ubWVldGluZykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNZWV0aW5nSW5mbyhtZWV0aW5nUmVzcG9uc2UubWVldGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRhYi50aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGYWxsYmFjayB0byB0YWIgdGl0bGUgaWYgbm8gbWVldGluZyBpbmZvIGlzIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVNZWV0aW5nSW5mbyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybTogdGFiLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVldGluZ0lkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgbWVldGluZyBpbmZvOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAodGFiLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1lZXRpbmdJbmZvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtOiB0YWIudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZWV0aW5nSWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDaGVjayByZWNvcmRpbmcgc3RhdGVcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZGluZ1N0YXRlID0gYXdhaXQgc2VuZE1lc3NhZ2VUb0JhY2tncm91bmQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlLkdFVF9SRUNPUkRJTkdfU1RBVEUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZWNvcmRpbmdTdGF0ZT8uaXNSZWNvcmRpbmcpIHtcbiAgICAgICAgICAgICAgICBpc1JlY29yZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZFRvZ2dsZUJ0biAmJiByZWNvcmRCdG5UZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZFRvZ2dsZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRUb2dnbGVCdG4uaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNpcmNsZVwiPjwvaT4gU3RvcCBSZWNvcmRpbmcnO1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRCdG5UZXh0LnRleHRDb250ZW50ID0gJ1N0b3AgUmVjb3JkaW5nJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXBkYXRlU3RhdHVzKCdSZWNvcmRpbmcgaW4gcHJvZ3Jlc3MnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIHN0YXJ0RHVyYXRpb25UaW1lcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlU3RhdHVzKCdObyBtZWV0aW5nIGRldGVjdGVkJywgJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIGlmIChtZWV0aW5nSW5mb0VsKVxuICAgICAgICAgICAgICAgIG1lZXRpbmdJbmZvRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIHBvcHVwOicsIGVycm9yKTtcbiAgICAgICAgdXBkYXRlU3RhdHVzKCdFcnJvciBpbml0aWFsaXppbmcnLCAnZXJyb3InKTtcbiAgICB9XG4gICAgLy8gTGlzdGVuIGZvciBtZWV0aW5nIHVwZGF0ZXNcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IE1lc3NhZ2VUeXBlLk1FRVRJTkdfREVURUNURUQpIHtcbiAgICAgICAgICAgIG1lZXRpbmdEZXRlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB1cGRhdGVTdGF0dXMoJ01lZXRpbmcgZGV0ZWN0ZWQnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UuZGF0YSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1lZXRpbmdJbmZvKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBNZXNzYWdlVHlwZS5QQVJUSUNJUEFOVFNfVVBEQVRFRCAmJiBtZXNzYWdlLmRhdGEpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50TWVldGluZykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRNZWV0aW5nLnBhcnRpY2lwYW50cyA9IG1lc3NhZ2UuZGF0YS5wYXJ0aWNpcGFudHMgfHwgW107XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2lwYW50Q291bnRFbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudENvdW50RWwudGV4dENvbnRlbnQgPSBjdXJyZW50TWVldGluZy5wYXJ0aWNpcGFudHMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWVldGluZy5wYXJ0aWNpcGFudHMubGVuZ3RoLnRvU3RyaW5nKCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJ05vbmUgZGV0ZWN0ZWQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCB0aGUgbWVzc2FnZSBjaGFubmVsIG9wZW4gZm9yIGFzeW5jIHJlc3BvbnNlXG4gICAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==