import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Navigate to a test page
  await page.goto('https://example.com');
  
  // Verify the page title
  await expect(page).toHaveTitle('Example Domain');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/example-screenshot.png' });
  
  // Log a message
  console.log('Test completed successfully!');
});
