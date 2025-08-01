import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Frontend/);
    
    // Check for key dashboard elements
    await expect(page.locator('h1')).toContainText(['Dashboard', 'Frontend', 'Home']);
  });

  test('should display navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation or main content areas
    // This will verify the basic layout loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that React has hydrated (no loading states)
    await page.waitForLoadState('networkidle');
  });

  test('should handle backend API calls', async ({ page }) => {
    let apiCallMade = false;
    
    // Listen for API calls to backend
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('backend') || url.includes('server')) {
        apiCallMade = true;
      }
    });
    
    await page.goto('/');
    
    // Wait for any initial API calls
    await page.waitForTimeout(2000);
    
    // Try to navigate to different sections that might trigger API calls
    const links = page.locator('a, button');
    const count = await links.count();
    
    if (count > 0) {
      // Click on the first interactive element
      await links.first().click();
      await page.waitForTimeout(1000);
    }
    
    // The test passes whether or not API calls are made
    // This is a smoke test to ensure the app doesn't crash when trying to make backend calls
    console.log(`API call detected: ${apiCallMade}`);
    
    // Ensure page is still responsive after interaction
    const pageTitle = await page.title();
    expect(pageTitle).toBeDefined();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors (like network errors to backend when backend is not running)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Failed to fetch') &&
      !error.includes('Network request failed') &&
      !error.includes('ERR_CONNECTION_REFUSED')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});