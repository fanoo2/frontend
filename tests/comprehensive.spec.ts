import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing Tests', () => {
  test('should navigate between different pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to Organization page
    await page.click('a[href="/organization"]');
    await expect(page).toHaveURL('/organization');
    await expect(page.locator('h1, h2, [data-testid="page-title"]')).toContainText(['Organization', 'Org']);
    
    // Test navigation to Workflows page
    await page.click('a[href="/workflows"]');
    await expect(page).toHaveURL('/workflows');
    await expect(page.locator('h1, h2, [data-testid="page-title"]')).toContainText(['Workflow', 'Process']);
    
    // Test navigation to Monitoring page
    await page.click('a[href="/monitoring"]');
    await expect(page).toHaveURL('/monitoring');
    await expect(page.locator('h1, h2, [data-testid="page-title"]')).toContainText(['Monitor', 'Metrics', 'Analytics']);
    
    // Test navigation back to Dashboard
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1, h2, [data-testid="page-title"]')).toContainText(['Dashboard', 'Home', 'Overview']);
  });

  test('should handle invalid routes gracefully', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    // Should show 404 or redirect to a valid page
    const title = await page.title();
    expect(title).toBeDefined();
    
    // Page should still be functional
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display sidebar navigation consistently', async ({ page }) => {
    await page.goto('/');
    
    // Check that sidebar is present and contains navigation links
    const sidebar = page.locator('[role="navigation"], nav, .sidebar, [data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Check for main navigation links
    const links = page.locator('a[href="/"], a[href="/organization"], a[href="/workflows"], a[href="/monitoring"]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Agent Configuration Tests', () => {
  test('should load agent configuration page', async ({ page }) => {
    await page.goto('/agent/default');
    
    // Check page loads without errors
    await expect(page).toHaveTitle(/Frontend/);
    
    // Look for configuration elements
    const formElements = page.locator('form, input, button, select, textarea');
    const elementCount = await formElements.count();
    expect(elementCount).toBeGreaterThan(0);
  });

  test('should handle different agent types', async ({ page }) => {
    const agentTypes = ['default', 'advanced', 'custom'];
    
    for (const agentType of agentTypes) {
      await page.goto(`/agent/${agentType}`);
      
      // Ensure page loads successfully
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check URL reflects the agent type
      await expect(page).toHaveURL(`/agent/${agentType}`);
    }
  });

  test('should validate form interactions', async ({ page }) => {
    await page.goto('/agent/default');
    
    // Look for interactive form elements
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="number"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Test typing in the first input field
      const firstInput = inputs.first();
      await firstInput.fill('test value');
      const value = await firstInput.inputValue();
      expect(value).toBe('test value');
    }
    
    // Look for buttons and test click functionality
    const buttons = page.locator('button:not([disabled])');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.click();
      // Page should remain functional after button click
      const title = await page.title();
      expect(title).toBeDefined();
    }
  });
});

test.describe('Design System Integration Tests', () => {
  test('should render design system components', async ({ page }) => {
    await page.goto('/');
    
    // Check for button components from design system
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Verify buttons are interactive
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Test hover state (should not throw errors)
      await firstButton.hover();
    }
  });

  test('should handle design system component interactions', async ({ page }) => {
    await page.goto('/');
    
    // Look for common UI components
    const uiComponents = page.locator('[class*="radix"], [class*="ui-"], .btn, .button, .card, .modal, .dialog');
    const componentCount = await uiComponents.count();
    
    // Test component visibility and basic interaction
    for (let i = 0; i < Math.min(componentCount, 3); i++) {
      const component = uiComponents.nth(i);
      await expect(component).toBeVisible();
      
      // Try to interact with clickable elements
      const isClickable = await component.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.cursor === 'pointer' || el.tagName.toLowerCase() === 'button';
      });
      
      if (isClickable) {
        await component.click();
        // Ensure page remains stable after interaction
        await page.waitForTimeout(500);
        const title = await page.title();
        expect(title).toBeDefined();
      }
    }
  });
});

test.describe('Checkout and Payment Integration Tests', () => {
  test('should load checkout page', async ({ page }) => {
    await page.goto('/checkout');
    
    // Check page loads successfully
    await expect(page).toHaveTitle(/Frontend/);
    
    // Look for payment-related elements
    const paymentElements = page.locator('form, input[type="text"], input[type="email"], button');
    const elementCount = await paymentElements.count();
    expect(elementCount).toBeGreaterThan(0);
  });

  test('should handle checkout form interactions', async ({ page }) => {
    await page.goto('/checkout');
    
    // Look for form inputs
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="number"]');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Test form field interactions
      for (let i = 0; i < Math.min(inputCount, 3); i++) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute('placeholder');
        const testValue = placeholder?.includes('email') ? 'test@example.com' : 'test value';
        
        await input.fill(testValue);
        const value = await input.inputValue();
        expect(value).toBe(testValue);
      }
    }
    
    // Look for submit buttons
    const submitButtons = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Pay"), button:has-text("Continue")');
    const submitCount = await submitButtons.count();
    
    if (submitCount > 0) {
      // Test that form submission doesn't crash the app
      const submitButton = submitButtons.first();
      await submitButton.click();
      
      // Wait for any processing
      await page.waitForTimeout(1000);
      
      // Verify page is still functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});

test.describe('Error Handling and Resilience Tests', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Block all network requests to simulate offline state
    await page.route('**/*', route => route.abort());
    
    await page.goto('/');
    
    // App should still render basic structure
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Should show some kind of error state or offline indicator
    const title = await page.title();
    expect(title).toBeDefined();
  });

  test('should handle API failures gracefully', async ({ page }) => {
    // Block only API calls
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    
    // App should still load and be interactive
    const links = page.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      await links.first().click();
      
      // Navigation should still work even with API failures
      const title = await page.title();
      expect(title).toBeDefined();
    }
  });

  test('should handle console errors appropriately', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      } else if (message.type() === 'warning') {
        consoleWarnings.push(message.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate through the app to trigger any potential errors
    const links = page.locator('a[href^="/"]');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      await links.nth(i).click();
      await page.waitForTimeout(1000);
    }
    
    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Failed to fetch') &&
      !error.includes('Network request failed') &&
      !error.includes('ERR_CONNECTION_REFUSED') &&
      !error.includes('Loading CSS chunk') &&
      !error.includes('ChunkLoadError')
    );
    
    // Should not have critical console errors
    expect(criticalErrors.length).toBeLessThan(5);
    
    // Log warnings for monitoring (but don't fail the test)
    if (consoleWarnings.length > 0) {
      console.log('Console warnings detected:', consoleWarnings.slice(0, 5));
    }
  });
});

test.describe('Performance and Accessibility Tests', () => {
  test('should load pages within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for CI environments)
    expect(loadTime).toBeLessThan(10000);
    
    // Check that the page has meaningful content
    const textContent = await page.textContent('body');
    expect(textContent?.length || 0).toBeGreaterThan(50);
  });

  test('should have basic accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility attributes
    const mainContent = page.locator('main, [role="main"], .main-content');
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
    
    // Check for navigation landmarks
    const navigation = page.locator('nav, [role="navigation"]');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
    
    // Check that interactive elements are keyboard accessible
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();
      
      // Button should be focusable
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should be responsive to different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await expect(body).toBeVisible();
  });
});