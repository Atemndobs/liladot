/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!****************************************!*\
  !*** ./src/content/meetingDetector.ts ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
// Store the current meeting info
let currentMeeting = null;
function detectMeeting() {
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
function getGoogleMeetId() {
    // Extract from URL: https://meet.google.com/xxx-yyyy-zzz
    const match = window.location.href.match(/meet\.google\.com\/([a-z0-9-]+)/i);
    return match ? match[1] : null;
}
function getGoogleMeetParticipants() {
    // Implementation would use the Google Meet API or DOM scraping
    // This is a placeholder - actual implementation would need to be updated
    return [];
}
function getZoomMeetingId() {
    // Extract from URL: https://zoom.us/j/123456789
    const match = window.location.href.match(/zoom\.us\/j\/(\d+)/i);
    return match ? match[1] : null;
}
function getZoomParticipants() {
    // Implementation would use the Zoom API or DOM scraping
    // This is a placeholder - actual implementation would need to be updated
    return [];
}
function getTeamsMeetingId() {
    // Extract from URL: https://teams.microsoft.com/l/meetup-join/...
    const match = window.location.href.match(/meetup-join\/([^/]+)/i);
    return match ? match[1] : null;
}
function getTeamsParticipants() {
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
        }
        else {
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
        }
        else {
            chrome.runtime.sendMessage({
                type: 'MEETING_ENDED',
            });
        }
    }
});
// Start observing the document with the configured parameters
observer.observe(document, { subtree: true, childList: true });


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC9tZWV0aW5nRGV0ZWN0b3IuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsZUFBZTtBQUMxQztBQUNBO0FBQ0EsMkJBQTJCLDhDQUE4QztBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZUFBZTtBQUN0QztBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDZCQUE2QixnQ0FBZ0M7QUFDbkQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saWxhZG90L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xpbGFkb3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9saWxhZG90Ly4vc3JjL2NvbnRlbnQvbWVldGluZ0RldGVjdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBTdG9yZSB0aGUgY3VycmVudCBtZWV0aW5nIGluZm9cbmxldCBjdXJyZW50TWVldGluZyA9IG51bGw7XG5mdW5jdGlvbiBkZXRlY3RNZWV0aW5nKCkge1xuICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIC8vIEdvb2dsZSBNZWV0XG4gICAgaWYgKHVybC5pbmNsdWRlcygnbWVldC5nb29nbGUuY29tJykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBsYXRmb3JtOiAnR29vZ2xlIE1lZXQnLFxuICAgICAgICAgICAgbWVldGluZ0lkOiBnZXRHb29nbGVNZWV0SWQoKSxcbiAgICAgICAgICAgIHBhcnRpY2lwYW50czogZ2V0R29vZ2xlTWVldFBhcnRpY2lwYW50cygpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBab29tXG4gICAgaWYgKHVybC5pbmNsdWRlcygnem9vbS51cy9qLycpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwbGF0Zm9ybTogJ1pvb20nLFxuICAgICAgICAgICAgbWVldGluZ0lkOiBnZXRab29tTWVldGluZ0lkKCksXG4gICAgICAgICAgICBwYXJ0aWNpcGFudHM6IGdldFpvb21QYXJ0aWNpcGFudHMoKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gTWljcm9zb2Z0IFRlYW1zXG4gICAgaWYgKHVybC5pbmNsdWRlcygndGVhbXMubWljcm9zb2Z0LmNvbScpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwbGF0Zm9ybTogJ01pY3Jvc29mdCBUZWFtcycsXG4gICAgICAgICAgICBtZWV0aW5nSWQ6IGdldFRlYW1zTWVldGluZ0lkKCksXG4gICAgICAgICAgICBwYXJ0aWNpcGFudHM6IGdldFRlYW1zUGFydGljaXBhbnRzKCksXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuLy8gUGxhdGZvcm0tc3BlY2lmaWMgZGV0ZWN0aW9uIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZ2V0R29vZ2xlTWVldElkKCkge1xuICAgIC8vIEV4dHJhY3QgZnJvbSBVUkw6IGh0dHBzOi8vbWVldC5nb29nbGUuY29tL3h4eC15eXl5LXp6elxuICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL21lZXRcXC5nb29nbGVcXC5jb21cXC8oW2EtejAtOS1dKykvaSk7XG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiBudWxsO1xufVxuZnVuY3Rpb24gZ2V0R29vZ2xlTWVldFBhcnRpY2lwYW50cygpIHtcbiAgICAvLyBJbXBsZW1lbnRhdGlvbiB3b3VsZCB1c2UgdGhlIEdvb2dsZSBNZWV0IEFQSSBvciBET00gc2NyYXBpbmdcbiAgICAvLyBUaGlzIGlzIGEgcGxhY2Vob2xkZXIgLSBhY3R1YWwgaW1wbGVtZW50YXRpb24gd291bGQgbmVlZCB0byBiZSB1cGRhdGVkXG4gICAgcmV0dXJuIFtdO1xufVxuZnVuY3Rpb24gZ2V0Wm9vbU1lZXRpbmdJZCgpIHtcbiAgICAvLyBFeHRyYWN0IGZyb20gVVJMOiBodHRwczovL3pvb20udXMvai8xMjM0NTY3ODlcbiAgICBjb25zdCBtYXRjaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC96b29tXFwudXNcXC9qXFwvKFxcZCspL2kpO1xuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGdldFpvb21QYXJ0aWNpcGFudHMoKSB7XG4gICAgLy8gSW1wbGVtZW50YXRpb24gd291bGQgdXNlIHRoZSBab29tIEFQSSBvciBET00gc2NyYXBpbmdcbiAgICAvLyBUaGlzIGlzIGEgcGxhY2Vob2xkZXIgLSBhY3R1YWwgaW1wbGVtZW50YXRpb24gd291bGQgbmVlZCB0byBiZSB1cGRhdGVkXG4gICAgcmV0dXJuIFtdO1xufVxuZnVuY3Rpb24gZ2V0VGVhbXNNZWV0aW5nSWQoKSB7XG4gICAgLy8gRXh0cmFjdCBmcm9tIFVSTDogaHR0cHM6Ly90ZWFtcy5taWNyb3NvZnQuY29tL2wvbWVldHVwLWpvaW4vLi4uXG4gICAgY29uc3QgbWF0Y2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvbWVldHVwLWpvaW5cXC8oW14vXSspL2kpO1xuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGdldFRlYW1zUGFydGljaXBhbnRzKCkge1xuICAgIC8vIEltcGxlbWVudGF0aW9uIHdvdWxkIHVzZSB0aGUgVGVhbXMgQVBJIG9yIERPTSBzY3JhcGluZ1xuICAgIC8vIFRoaXMgaXMgYSBwbGFjZWhvbGRlciAtIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiB3b3VsZCBuZWVkIHRvIGJlIHVwZGF0ZWRcbiAgICByZXR1cm4gW107XG59XG4vLyBDaGVjayBpZiB3ZSdyZSBvbiBhIG1lZXRpbmcgcGFnZSB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCBsb2Fkc1xuZnVuY3Rpb24gY2hlY2tGb3JNZWV0aW5nKCkge1xuICAgIGNvbnN0IG1lZXRpbmcgPSBkZXRlY3RNZWV0aW5nKCk7XG4gICAgaWYgKG1lZXRpbmcpIHtcbiAgICAgICAgY3VycmVudE1lZXRpbmcgPSBtZWV0aW5nO1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAnTUVFVElOR19ERVRFQ1RFRCcsXG4gICAgICAgICAgICBkYXRhOiBtZWV0aW5nXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8vIExpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSB0aGUgYmFja2dyb3VuZCBzY3JpcHRcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnR0VUX1JFQ09SRElOR19TVEFURScpIHtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgIGlzTWVldGluZzogY3VycmVudE1lZXRpbmcgIT09IG51bGwsXG4gICAgICAgICAgICBtZWV0aW5nOiBjdXJyZW50TWVldGluZ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIEtlZXAgdGhlIG1lc3NhZ2UgY2hhbm5lbCBvcGVuIGZvciB0aGUgcmVzcG9uc2VcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ1NUQVJUX1JFQ09SRElORycpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRNZWV0aW5nKSB7XG4gICAgICAgICAgICAvLyBTdGFydCByZWNvcmRpbmcgbG9naWMgaGVyZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0aW5nIHJlY29yZGluZyBmb3IgbWVldGluZzonLCBjdXJyZW50TWVldGluZyk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gbWVldGluZyBkZXRlY3RlZCcgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdTVE9QX1JFQ09SRElORycpIHtcbiAgICAgICAgLy8gU3RvcCByZWNvcmRpbmcgbG9naWMgaGVyZVxuICAgICAgICBjb25zb2xlLmxvZygnU3RvcHBpbmcgcmVjb3JkaW5nJyk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pO1xuLy8gSW5pdGlhbCBjaGVjayB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCBsb2Fkc1xuY2hlY2tGb3JNZWV0aW5nKCk7XG4vLyBBbHNvIGNoZWNrIHdoZW4gdGhlIFVSTCBjaGFuZ2VzXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGNoZWNrRm9yTWVldGluZyk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBjaGVja0Zvck1lZXRpbmcpO1xuLy8gV2F0Y2ggZm9yIFVSTCBjaGFuZ2VzIHRvIGRldGVjdCB3aGVuIHVzZXIgam9pbnMvbGVhdmVzIGEgbWVldGluZ1xubGV0IGxhc3RVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbmNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiAhPT0gbGFzdFVybCkge1xuICAgICAgICBsYXN0VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIGNvbnN0IG5ld01lZXRpbmdJbmZvID0gZGV0ZWN0TWVldGluZygpO1xuICAgICAgICBpZiAobmV3TWVldGluZ0luZm8pIHtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnTUVFVElOR19ERVRFQ1RFRCcsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IG5ld01lZXRpbmdJbmZvLnBsYXRmb3JtLFxuICAgICAgICAgICAgICAgIG1lZXRpbmdJZDogbmV3TWVldGluZ0luZm8ubWVldGluZ0lkLFxuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50czogbmV3TWVldGluZ0luZm8ucGFydGljaXBhbnRzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ01FRVRJTkdfRU5ERUQnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbi8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZG9jdW1lbnQgd2l0aCB0aGUgY29uZmlndXJlZCBwYXJhbWV0ZXJzXG5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IHN1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSB9KTtcbmV4cG9ydCB7fTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==