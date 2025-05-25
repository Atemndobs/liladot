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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_meetingUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/meetingUtils */ "./src/utils/meetingUtils.ts");
/* harmony import */ var _utils_messaging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/messaging */ "./src/utils/messaging.ts");
// Background service worker for LilaDot


// Keep track of recording state
let isRecording = false;
let recordingStartTime = null;
// Listen for installation event
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('LilaDot extension installed');
        // Initialize default settings
        const defaultSettings = {
            autoStart: false,
            audioQuality: 'high',
            saveTranscripts: true,
        };
        chrome.storage.local.set({ settings: defaultSettings });
    }
});
// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, data } = request;
    const tabId = sender.tab?.id;
    const respond = (response) => {
        if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            sendResponse({
                success: false,
                error: chrome.runtime.lastError.message
            });
        }
        else {
            sendResponse({ success: true, ...response });
        }
    };
    switch (type) {
        case _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.START_RECORDING:
            if (tabId === undefined) {
                respond({ error: 'No active tab found' });
                return true;
            }
            handleStartRecording(tabId, respond);
            return true; // Required for async sendResponse
        case _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.STOP_RECORDING:
            if (tabId === undefined) {
                respond({ error: 'No active tab found' });
                return true;
            }
            handleStopRecording(tabId, respond);
            return true;
        case _utils_messaging__WEBPACK_IMPORTED_MODULE_1__.MessageType.GET_RECORDING_STATE:
            respond({
                isRecording,
                startTime: recordingStartTime
            });
            return true;
            // removed by dead control flow
{}
            // removed by dead control flow
{}
        default:
            return false;
    }
});
async function handleStartRecording(tabId, sendResponse) {
    try {
        // Request tab capture permissions
        const streamId = await new Promise((resolve, reject) => {
            chrome.tabCapture.getMediaStreamId({}, (streamId) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                else {
                    resolve(streamId);
                }
            });
        });
        // Send stream ID to content script
        await chrome.tabs.sendMessage(tabId, {
            action: 'START_RECORDING',
            streamId,
        });
        sendResponse({ success: true });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error starting recording:', errorMessage);
        sendResponse({
            success: false,
            error: errorMessage,
        });
    }
}
async function handleStopRecording(tabId, sendResponse) {
    try {
        await chrome.tabs.sendMessage(tabId, {
            action: 'STOP_RECORDING',
        });
        sendResponse({ success: true });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error stopping recording:', errorMessage);
        sendResponse({
            success: false,
            error: errorMessage,
        });
    }
}
async function handleGetStatus(sendResponse) {
    try {
        const result = await chrome.storage.local.get('settings');
        const settings = result.settings;
        sendResponse({ success: true, settings });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get settings';
        console.error('Error getting status:', errorMessage);
        sendResponse({
            success: false,
            error: errorMessage,
        });
    }
}
// Handle tab updates to detect meeting platforms
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Check if the URL matches a supported meeting platform
        if ((0,_utils_meetingUtils__WEBPACK_IMPORTED_MODULE_0__.isMeetingUrl)(tab.url)) {
            // Inject content script
            chrome.scripting
                .executeScript({
                target: { tabId },
                files: ['content/meetingDetector.js'],
            })
                .catch((error) => {
                console.error('Failed to inject content script:', error);
            });
        }
    }
});
// Meeting detection and handling functions moved to src/utils/meetingUtils.ts

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULHVCQUF1QixlQUFlO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxpRUFBWTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsT0FBTztBQUNqQztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saWxhZG90Ly4vc3JjL3V0aWxzL21lZXRpbmdVdGlscy50cyIsIndlYnBhY2s6Ly9saWxhZG90Ly4vc3JjL3V0aWxzL21lc3NhZ2luZy50cyIsIndlYnBhY2s6Ly9saWxhZG90L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xpbGFkb3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2xpbGFkb3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9saWxhZG90L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbGlsYWRvdC8uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBVUkwgbWF0Y2hlcyBhbnkgb2YgdGhlIHN1cHBvcnRlZCBtZWV0aW5nIHBsYXRmb3Jtc1xuICogQHBhcmFtIHVybCBUaGUgVVJMIHRvIGNoZWNrXG4gKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIFVSTCBpcyBhIHN1cHBvcnRlZCBtZWV0aW5nIHBsYXRmb3JtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01lZXRpbmdVcmwodXJsKSB7XG4gICAgY29uc3QgbWVldGluZ1BhdHRlcm5zID0gW1xuICAgICAgICAvXmh0dHBzPzpcXC9cXC9tZWV0XFwuZ29vZ2xlXFwuY29tXFwvLyxcbiAgICAgICAgL15odHRwcz86XFwvXFwvem9vbVxcLnVzXFwvalxcLy8sXG4gICAgICAgIC9eaHR0cHM/OlxcL1xcL3RlYW1zXFwubWljcm9zb2Z0XFwuY29tXFwvbFxcL21lZXRpbmcvLFxuICAgICAgICAvXmh0dHBzPzpcXC9cXC90ZWFtc1xcLm1pY3Jvc29mdFxcLmNvbVxcL21lZXRpbmcvLFxuICAgIF07XG4gICAgcmV0dXJuIG1lZXRpbmdQYXR0ZXJucy5zb21lKChwYXR0ZXJuKSA9PiBwYXR0ZXJuLnRlc3QodXJsKSk7XG59XG4vKipcbiAqIERldGVjdHMgdGhlIG1lZXRpbmcgcGxhdGZvcm0gYmFzZWQgb24gdGhlIFVSTFxuICogQHBhcmFtIHVybCBUaGUgVVJMIHRvIGNoZWNrXG4gKiBAcmV0dXJucyBUaGUgbmFtZSBvZiB0aGUgZGV0ZWN0ZWQgbWVldGluZyBwbGF0Zm9ybVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0TWVldGluZ1BsYXRmb3JtKHVybCkge1xuICAgIGlmICh1cmwuaW5jbHVkZXMoJ21lZXQuZ29vZ2xlLmNvbScpKVxuICAgICAgICByZXR1cm4gJ0dvb2dsZSBNZWV0JztcbiAgICBpZiAodXJsLmluY2x1ZGVzKCd6b29tLnVzJykpXG4gICAgICAgIHJldHVybiAnWm9vbSc7XG4gICAgaWYgKHVybC5pbmNsdWRlcygndGVhbXMubWljcm9zb2Z0LmNvbScpKVxuICAgICAgICByZXR1cm4gJ01pY3Jvc29mdCBUZWFtcyc7XG4gICAgcmV0dXJuICdVbmtub3duJztcbn1cbi8qKlxuICogRXh0cmFjdHMgbWVldGluZyBJRCBmcm9tIFVSTCBpZiBwb3NzaWJsZVxuICogQHBhcmFtIHVybCBUaGUgbWVldGluZyBVUkxcbiAqIEByZXR1cm5zIFRoZSBtZWV0aW5nIElEIG9yIG51bGwgaWYgbm90IGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TWVldGluZ0lkKHVybCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwodXJsKTtcbiAgICAgICAgLy8gR29vZ2xlIE1lZXRcbiAgICAgICAgaWYgKHVybE9iai5ob3N0bmFtZSA9PT0gJ21lZXQuZ29vZ2xlLmNvbScpIHtcbiAgICAgICAgICAgIHJldHVybiB1cmxPYmoucGF0aG5hbWUuc3BsaXQoJy8nKS5wb3AoKSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIFpvb21cbiAgICAgICAgaWYgKHVybE9iai5ob3N0bmFtZSA9PT0gJ3pvb20udXMnICYmIHVybE9iai5wYXRobmFtZS5zdGFydHNXaXRoKCcvai8nKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVybE9iai5wYXRobmFtZS5zcGxpdCgnL2ovJykucG9wKCkgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBNaWNyb3NvZnQgVGVhbXNcbiAgICAgICAgaWYgKHVybE9iai5ob3N0bmFtZS5pbmNsdWRlcygndGVhbXMubWljcm9zb2Z0LmNvbScpKSB7XG4gICAgICAgICAgICBjb25zdCBtZWV0aW5nSWRNYXRjaCA9IHVybC5tYXRjaCgvbWVldHVwLWpvaW5cXC8oW14vXSspLyk7XG4gICAgICAgICAgICByZXR1cm4gbWVldGluZ0lkTWF0Y2ggPyBtZWV0aW5nSWRNYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBleHRyYWN0aW5nIG1lZXRpbmcgSUQ6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG4iLCIvKipcbiAqIE1lc3NhZ2luZyB1dGlsaXRpZXMgZm9yIENocm9tZSBleHRlbnNpb24gbWVzc2FnZSBwYXNzaW5nXG4gKiBIYW5kbGVzIGNvbW11bmljYXRpb24gYmV0d2VlbiBwb3B1cCwgY29udGVudCBzY3JpcHRzLCBhbmQgYmFja2dyb3VuZFxuICovXG5leHBvcnQgY29uc3QgTWVzc2FnZVR5cGUgPSB7XG4gICAgU1RBUlRfUkVDT1JESU5HOiAnU1RBUlRfUkVDT1JESU5HJyxcbiAgICBTVE9QX1JFQ09SRElORzogJ1NUT1BfUkVDT1JESU5HJyxcbiAgICBSRUNPUkRJTkdfU1RBUlRFRDogJ1JFQ09SRElOR19TVEFSVEVEJyxcbiAgICBSRUNPUkRJTkdfU1RPUFBFRDogJ1JFQ09SRElOR19TVE9QUEVEJyxcbiAgICBNRUVUSU5HX0RFVEVDVEVEOiAnTUVFVElOR19ERVRFQ1RFRCcsXG4gICAgTUVFVElOR19FTkRFRDogJ01FRVRJTkdfRU5ERUQnLFxuICAgIEdFVF9SRUNPUkRJTkdfU1RBVEU6ICdHRVRfUkVDT1JESU5HX1NUQVRFJyxcbiAgICBHRVRfTUVFVElOR19JTkZPOiAnR0VUX01FRVRJTkdfSU5GTycsXG4gICAgUEFSVElDSVBBTlRTX1VQREFURUQ6ICdQQVJUSUNJUEFOVFNfVVBEQVRFRCcsXG4gICAgRVJST1I6ICdFUlJPUicsXG59O1xuLyoqXG4gKiBUeXBlIGd1YXJkIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgYSB2YWxpZCBtZXNzYWdlIHR5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTWVzc2FnZVR5cGUodmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhNZXNzYWdlVHlwZSkuaW5jbHVkZXModmFsdWUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRNZXNzYWdlVG9CYWNrZ3JvdW5kKHR5cGUsIGRhdGEpIHtcbiAgICAvLyBIYW5kbGUgYm90aCBvYmplY3Qtc3R5bGUgYW5kIHNpbXBsZSB0eXBlICsgZGF0YSBzdHlsZVxuICAgIGNvbnN0IG1lc3NhZ2VPYmogPSB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgPyB0eXBlIDogeyB0eXBlLCBkYXRhIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2VPYmosIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZW5kaW5nIG1lc3NhZ2U6JywgeyB0eXBlLCBlcnJvciB9KTtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogU2VuZCBhIG1lc3NhZ2UgdG8gYSBzcGVjaWZpYyB0YWJcbiAqIEBwYXJhbSB0YWJJZCBUaGUgSUQgb2YgdGhlIHRhYiB0byBzZW5kIHRoZSBtZXNzYWdlIHRvXG4gKiBAcGFyYW0gdHlwZSBUaGUgbWVzc2FnZSB0eXBlXG4gKiBAcGFyYW0gZGF0YSBPcHRpb25hbCBkYXRhIHRvIHNlbmQgd2l0aCB0aGUgbWVzc2FnZVxuICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlc3BvbnNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kTWVzc2FnZVRvVGFiKHRhYklkLCB0eXBlLCBkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCB7IHR5cGUsIGRhdGEgfSwgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlbmRpbmcgbWVzc2FnZSB0byB0YWI6JywgeyB0YWJJZCwgdHlwZSwgZXJyb3IgfSk7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIEFkZCBhIG1lc3NhZ2UgbGlzdGVuZXJcbiAqIEBwYXJhbSBoYW5kbGVyIEZ1bmN0aW9uIHRvIGhhbmRsZSBpbmNvbWluZyBtZXNzYWdlc1xuICogQHJldHVybnMgRnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lclxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkTWVzc2FnZUxpc3RlbmVyKGhhbmRsZXIpIHtcbiAgICBjb25zdCB3cmFwcGVkSGFuZGxlciA9IChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZSAmJlxuICAgICAgICAgICAgdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAndHlwZScgaW4gbWVzc2FnZSAmJlxuICAgICAgICAgICAgaXNNZXNzYWdlVHlwZShtZXNzYWdlLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBoYW5kbGVyKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vIFJldHVybiB0cnVlIHRvIGluZGljYXRlIHdlIHdhbnQgdG8gc2VuZCBhIHJlc3BvbnNlIGFzeW5jaHJvbm91c2x5XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC50aGVuKChzaG91bGRTZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZFNlbmRSZXNwb25zZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIod3JhcHBlZEhhbmRsZXIpO1xuICAgIC8vIFJldHVybiBhIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGlzIGxpc3RlbmVyXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHdyYXBwZWRIYW5kbGVyKTtcbiAgICB9O1xufVxuLy8gTWVzc2FnZVNlbmRlciBpcyBhbHJlYWR5IGV4cG9ydGVkIGFib3ZlXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIEJhY2tncm91bmQgc2VydmljZSB3b3JrZXIgZm9yIExpbGFEb3RcbmltcG9ydCB7IGlzTWVldGluZ1VybCB9IGZyb20gJy4vdXRpbHMvbWVldGluZ1V0aWxzJztcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi91dGlscy9tZXNzYWdpbmcnO1xuLy8gS2VlcCB0cmFjayBvZiByZWNvcmRpbmcgc3RhdGVcbmxldCBpc1JlY29yZGluZyA9IGZhbHNlO1xubGV0IHJlY29yZGluZ1N0YXJ0VGltZSA9IG51bGw7XG4vLyBMaXN0ZW4gZm9yIGluc3RhbGxhdGlvbiBldmVudFxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKGRldGFpbHMpID0+IHtcbiAgICBpZiAoZGV0YWlscy5yZWFzb24gPT09ICdpbnN0YWxsJykge1xuICAgICAgICBjb25zb2xlLmxvZygnTGlsYURvdCBleHRlbnNpb24gaW5zdGFsbGVkJyk7XG4gICAgICAgIC8vIEluaXRpYWxpemUgZGVmYXVsdCBzZXR0aW5nc1xuICAgICAgICBjb25zdCBkZWZhdWx0U2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBhdXRvU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgYXVkaW9RdWFsaXR5OiAnaGlnaCcsXG4gICAgICAgICAgICBzYXZlVHJhbnNjcmlwdHM6IHRydWUsXG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNldHRpbmdzOiBkZWZhdWx0U2V0dGluZ3MgfSk7XG4gICAgfVxufSk7XG4vLyBIYW5kbGUgbWVzc2FnZXMgZnJvbSBwb3B1cCBhbmQgY29udGVudCBzY3JpcHRzXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc3QgeyB0eXBlLCBkYXRhIH0gPSByZXF1ZXN0O1xuICAgIGNvbnN0IHRhYklkID0gc2VuZGVyLnRhYj8uaWQ7XG4gICAgY29uc3QgcmVzcG9uZCA9IChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSdW50aW1lIGVycm9yOicsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCAuLi5yZXNwb25zZSB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU1RBUlRfUkVDT1JESU5HOlxuICAgICAgICAgICAgaWYgKHRhYklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXNwb25kKHsgZXJyb3I6ICdObyBhY3RpdmUgdGFiIGZvdW5kJyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbmRsZVN0YXJ0UmVjb3JkaW5nKHRhYklkLCByZXNwb25kKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBSZXF1aXJlZCBmb3IgYXN5bmMgc2VuZFJlc3BvbnNlXG4gICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuU1RPUF9SRUNPUkRJTkc6XG4gICAgICAgICAgICBpZiAodGFiSWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbmQoeyBlcnJvcjogJ05vIGFjdGl2ZSB0YWIgZm91bmQnIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFuZGxlU3RvcFJlY29yZGluZyh0YWJJZCwgcmVzcG9uZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5HRVRfUkVDT1JESU5HX1NUQVRFOlxuICAgICAgICAgICAgcmVzcG9uZCh7XG4gICAgICAgICAgICAgICAgaXNSZWNvcmRpbmcsXG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiByZWNvcmRpbmdTdGFydFRpbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBoYW5kbGVHZXRTdGF0dXMocmVzcG9uZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KTtcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0UmVjb3JkaW5nKHRhYklkLCBzZW5kUmVzcG9uc2UpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBSZXF1ZXN0IHRhYiBjYXB0dXJlIHBlcm1pc3Npb25zXG4gICAgICAgIGNvbnN0IHN0cmVhbUlkID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hyb21lLnRhYkNhcHR1cmUuZ2V0TWVkaWFTdHJlYW1JZCh7fSwgKHN0cmVhbUlkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc3RyZWFtSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gU2VuZCBzdHJlYW0gSUQgdG8gY29udGVudCBzY3JpcHRcbiAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ1NUQVJUX1JFQ09SRElORycsXG4gICAgICAgICAgICBzdHJlYW1JZCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yIG9jY3VycmVkJztcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc3RhcnRpbmcgcmVjb3JkaW5nOicsIGVycm9yTWVzc2FnZSk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN0b3BSZWNvcmRpbmcodGFiSWQsIHNlbmRSZXNwb25zZSkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdTVE9QX1JFQ09SRElORycsXG4gICAgICAgIH0pO1xuICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvciBvY2N1cnJlZCc7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHN0b3BwaW5nIHJlY29yZGluZzonLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRTdGF0dXMoc2VuZFJlc3BvbnNlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzZXR0aW5ncycpO1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHJlc3VsdC5zZXR0aW5ncztcbiAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgc2V0dGluZ3MgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdGYWlsZWQgdG8gZ2V0IHNldHRpbmdzJztcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBzdGF0dXM6JywgZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLy8gSGFuZGxlIHRhYiB1cGRhdGVzIHRvIGRldGVjdCBtZWV0aW5nIHBsYXRmb3Jtc1xuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKCh0YWJJZCwgY2hhbmdlSW5mbywgdGFiKSA9PiB7XG4gICAgaWYgKGNoYW5nZUluZm8uc3RhdHVzID09PSAnY29tcGxldGUnICYmIHRhYi51cmwpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIFVSTCBtYXRjaGVzIGEgc3VwcG9ydGVkIG1lZXRpbmcgcGxhdGZvcm1cbiAgICAgICAgaWYgKGlzTWVldGluZ1VybCh0YWIudXJsKSkge1xuICAgICAgICAgICAgLy8gSW5qZWN0IGNvbnRlbnQgc2NyaXB0XG4gICAgICAgICAgICBjaHJvbWUuc2NyaXB0aW5nXG4gICAgICAgICAgICAgICAgLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2NvbnRlbnQvbWVldGluZ0RldGVjdG9yLmpzJ10sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5qZWN0IGNvbnRlbnQgc2NyaXB0OicsIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4vLyBNZWV0aW5nIGRldGVjdGlvbiBhbmQgaGFuZGxpbmcgZnVuY3Rpb25zIG1vdmVkIHRvIHNyYy91dGlscy9tZWV0aW5nVXRpbHMudHNcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==