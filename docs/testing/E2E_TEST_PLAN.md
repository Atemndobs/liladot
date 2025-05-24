# LilaDot Chrome Extension - End-to-End Test Plan

## Table of Contents
1. [Introduction](#introduction)
2. [Test Environment](#test-environment)
3. [Test Scope](#test-scope)
4. [Test Scenarios](#test-scenarios)
5. [Test Data](#test-data)
6. [Test Execution](#test-execution)
7. [CI/CD Integration](#cicd-integration)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Accessibility Testing](#accessibility-testing)
11. [Test Maintenance](#test-maintenance)
12. [Appendix](#appendix)

## Introduction

### Purpose
This document outlines the End-to-End (E2E) testing strategy for the LilaDot Chrome Extension, ensuring comprehensive test coverage of all critical user journeys and system integrations.

### Document Version
- **Version**: 1.0.0
- **Last Updated**: 2025-05-24
- **Owner**: QA Team

## Test Environment

### Prerequisites
- Node.js v16+
- Chrome/Chromium browser (latest stable)
- Playwright test runner
- Dedicated Chrome profile for test automation

### Configuration
```yaml
# playwright.config.ts
export default {
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};
```

## Test Scope

### In Scope
- Meeting detection across platforms
- Audio recording functionality
- Real-time transcription
- User interface interactions
- Data persistence
- Error handling

### Out of Scope
- Unit tests
- Integration tests
- Performance benchmarks
- Security penetration testing

## Test Scenarios

### 1. Installation & Initialization
#### 1.1 Extension Installation
- Verify successful installation from Chrome Web Store
- Check required permissions are requested
- Validate extension icon appears in Chrome toolbar

#### 1.2 First Run Experience
- Welcome screen display
- Permission requests handling
- Default settings initialization
- Tutorial/onboarding flow

### 2. Meeting Detection
#### 2.1 Automatic Detection
- Zoom meeting detection
- Google Meet detection
- Microsoft Teams detection
- WebEx detection
- Custom meeting URL patterns

#### 2.2 Manual Control
- Manual meeting start/stop
- Meeting info display
- Active meeting indicators
- Multiple meeting handling

### 3. Recording Functionality
#### 3.1 Audio Capture
- Microphone access and permissions
- Audio quality and levels
- Background recording behavior
- System audio capture (if applicable)

#### 3.2 State Management
- Recording state persistence
- Tab/window switching
- Browser restart recovery
- Multiple tab handling

### 4. Transcription
#### 4.1 Real-time Transcription
- Text appears during meeting
- Speaker differentiation
- Timestamp accuracy
- Special character handling

#### 4.2 Post-meeting Processing
- Final transcription generation
- Export formats (TXT, DOCX, PDF)
- Timestamp inclusion
- Speaker labeling

## Test Data

### Test Accounts
| Platform | Test Account | Password | Notes |
|----------|--------------|----------|-------|
| Zoom | test@example.com | ******** | Pro account |
| Google Meet | meet.test@example.com | ******** | GSuite account |
| Teams | teams.test@example.com | ******** | Business account |

### Test Meetings
| ID | Platform | Duration | Speakers | Purpose |
|----|----------|----------|----------|----------|
| M001 | Zoom | 15m | 2 | Basic functionality |
| M002 | Google Meet | 30m | 5 | Multiple speakers |
| M003 | Teams | 60m | 10 | Long meeting |

## Test Execution

### Test Suite Structure
```
tests/
├── e2e/
│   ├── fixtures/          # Test data
│   ├── pages/             # Page objects
│   ├── utils/             # Test utilities
│   ├── meeting/           # Meeting tests
│   │   ├── detection.spec.ts
│   │   └── recording.spec.ts
│   ├── ui/
│   │   └── settings.spec.ts
│   └── utils/
│       └── helpers.ts
└── unit/                  # Unit tests (out of scope)
```

### Example Test Case
```typescript
// tests/e2e/meeting/detection.spec.ts
import { test } from '@playwright/test';
import { MeetingPage } from '../pages/meeting-page';

test.describe('Meeting Detection', () => {
  let meetingPage: MeetingPage;

  test.beforeEach(async ({ page }) => {
    meetingPage = new MeetingPage(page);
    await meetingPage.navigate();
  });

  test('should detect Zoom meeting', async () => {
    await meetingPage.startMeeting('zoom');
    await meetingPage.verifyMeetingDetected();
    await meetingPage.verifyRecordingControlsVisible();
  });

  test('should handle meeting end', async () => {
    await meetingPage.startMeeting('google-meet');
    await meetingPage.endMeeting();
    await meetingPage.verifyMeetingEnded();
  });
});
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npx playwright test
        env:
          CI: true
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

## Performance Testing

### Key Metrics
| Metric | Target | Measurement |
|--------|---------|-------------|
| CPU Usage | < 30% | Chrome DevTools |
| Memory Usage | < 500MB | Chrome Task Manager |
| Load Time | < 2s | Web Vitals |
| TTFB | < 500ms | Web Vitals |

## Security Testing

### Test Cases
1. **Data Protection**
   - Verify sensitive data encryption
   - Check secure storage implementation
   - Test data transmission security

2. **Permission Model**
   - Validate permission scopes
   - Test permission escalation
   - Verify data access controls

## Accessibility Testing

### WCAG 2.1 Compliance
- [ ] 1.1.1 Non-text Content (A)
- [ ] 1.3.1 Info and Relationships (A)
- [ ] 1.4.3 Contrast (Minimum) (AA)
- [ ] 2.1.1 Keyboard (A)
- [ ] 2.4.4 Link Purpose (In Context) (A)

## Test Maintenance

### Test Documentation
- [Test Case Template](.github/ISSUE_TEMPLATE/test-case.md)
- [Bug Report Template](.github/ISSUE_TEMPLATE/bug-report.md)
- [Test Data Management](docs/testing/TEST_DATA.md)

### Flaky Test Handling
1. Identify flaky tests
2. Add to quarantine
3. Investigate root cause
4. Fix or rewrite test
5. Move back to main suite

## Appendix

### A. Test Data Generation
```typescript
// tests/e2e/utils/test-data-generator.ts
export function generateMeetingData(platform: string) {
  // Implementation
}
```

### B. Common Issues and Solutions
| Issue | Solution |
|-------|----------|
| Element not found | Increase timeout or add retry logic |
| Flaky tests | Add test retries and better selectors |
| Slow performance | Optimize test data and parallel execution |

### C. Performance Budget
| Resource | Budget |
|----------|--------|
| JS Bundle | < 200KB |
| CSS | < 50KB |
| Images | < 500KB total |
| Load Time | < 3s (3G) |

### D. Test Coverage Report
Coverage reports are generated after each test run and available in the `coverage/` directory.

### E. Related Documents
- [Project Requirements](docs/requirements.md)
- [API Documentation](docs/api/README.md)
- [Development Setup](docs/development.md)

---
*Document last updated: 2025-05-24*
