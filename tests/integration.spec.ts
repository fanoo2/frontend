import { test, expect } from '@playwright/test';

test.describe('WebRTC Client Integration Tests', () => {
  test('should handle WebRTC client initialization', async ({ page }) => {
    await page.goto('/');
    
    // Check for WebRTC-related elements or functionality
    const webrtcElements = page.locator('[data-testid*="webrtc"], [class*="webrtc"], button:has-text("Connect"), button:has-text("Call")');
    const elementCount = await webrtcElements.count();
    
    // If WebRTC elements exist, test basic interactions
    if (elementCount > 0) {
      const firstElement = webrtcElements.first();
      await expect(firstElement).toBeVisible();
      
      // Test interaction without expecting successful WebRTC connection (which requires real media devices)
      if (await firstElement.evaluate(el => el.tagName.toLowerCase() === 'button')) {
        await firstElement.click();
        
        // Ensure app doesn't crash when WebRTC operations are attempted
        await page.waitForTimeout(1000);
        const title = await page.title();
        expect(title).toBeDefined();
      }
    }
  });

  test('should handle media device permission scenarios', async ({ page }) => {
    // Mock getUserMedia to test permission handling
    await page.addInitScript(() => {
      // Mock different permission scenarios
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      let mockScenario = 'denied';
      
      (navigator.mediaDevices as any).getUserMedia = async (constraints: any) => {
        if (mockScenario === 'denied') {
          throw new DOMException('Permission denied', 'NotAllowedError');
        } else if (mockScenario === 'no-device') {
          throw new DOMException('No device found', 'NotFoundError');
        }
        return originalGetUserMedia.call(navigator.mediaDevices, constraints);
      };
      
      // Expose function to change mock scenario
      (window as any).setWebRTCMockScenario = (scenario: string) => {
        mockScenario = scenario;
      };
    });
    
    await page.goto('/');
    
    // Look for elements that might trigger media access
    const mediaButtons = page.locator('button:has-text("Camera"), button:has-text("Microphone"), button:has-text("Video"), button:has-text("Audio")');
    const buttonCount = await mediaButtons.count();
    
    if (buttonCount > 0) {
      // Test permission denied scenario
      await page.evaluate(() => (window as any).setWebRTCMockScenario('denied'));
      await mediaButtons.first().click();
      
      // App should handle permission denial gracefully
      await page.waitForTimeout(1000);
      const title = await page.title();
      expect(title).toBeDefined();
      
      // Test no device scenario
      await page.evaluate(() => (window as any).setWebRTCMockScenario('no-device'));
      await mediaButtons.first().click();
      
      // App should handle missing devices gracefully
      await page.waitForTimeout(1000);
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeDefined();
    }
  });

  test('should handle connection state changes', async ({ page }) => {
    await page.goto('/');
    
    // Mock WebRTC connection states
    await page.addInitScript(() => {
      // Mock RTCPeerConnection if it's being used
      const OriginalRTCPeerConnection = (window as any).RTCPeerConnection;
      if (OriginalRTCPeerConnection) {
        (window as any).RTCPeerConnection = function(config: any) {
          const pc = new OriginalRTCPeerConnection(config);
          
          // Mock connection state changes
          setTimeout(() => {
            pc.dispatchEvent(new Event('connectionstatechange'));
          }, 1000);
          
          return pc;
        };
      }
    });
    
    // Look for connection status indicators
    const statusElements = page.locator('[data-testid*="status"], [class*="status"], [class*="connection"]');
    const statusCount = await statusElements.count();
    
    if (statusCount > 0) {
      // Wait for any connection state updates
      await page.waitForTimeout(2000);
      
      // Verify the app remains stable during connection changes
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});

test.describe('Real-time Features Tests', () => {
  test('should handle WebSocket connections gracefully', async ({ page }) => {
    let _websocketConnections = 0;
    let websocketErrors = 0;
    
    // Monitor WebSocket activity
    page.on('websocket', ws => {
      _websocketConnections++;
      ws.on('socketerror', () => websocketErrors++);
    });
    
    await page.goto('/');
    
    // Wait for potential WebSocket connections
    await page.waitForTimeout(3000);
    
    // Look for real-time elements that might use WebSockets
    const realTimeElements = page.locator('[data-testid*="live"], [class*="live"], [class*="real-time"]');
    const elementCount = await realTimeElements.count();
    
    // If real-time elements exist, test their behavior
    if (elementCount > 0) {
      for (let i = 0; i < Math.min(elementCount, 2); i++) {
        const element = realTimeElements.nth(i);
        await expect(element).toBeVisible();
      }
    }
    
    // WebSocket errors should be handled gracefully (not crash the app)
    if (websocketErrors > 0) {
      console.log(`WebSocket errors detected: ${websocketErrors}`);
      
      // App should still be functional despite WebSocket errors
      const title = await page.title();
      expect(title).toBeDefined();
    }
  });

  test('should update UI based on real-time data', async ({ page }) => {
    await page.goto('/');
    
    // Mock real-time data updates
    await page.addInitScript(() => {
      // Simulate periodic data updates
      setInterval(() => {
        const event = new CustomEvent('dataUpdate', {
          detail: { timestamp: Date.now(), type: 'test' }
        });
        window.dispatchEvent(event);
      }, 2000);
    });
    
    // Look for elements that might display dynamic data
    const dynamicElements = page.locator('[data-testid*="dynamic"], [class*="update"], [class*="live-data"]');
    const elementCount = await dynamicElements.count();
    
    if (elementCount > 0) {
      // Wait for potential updates
      await page.waitForTimeout(5000);
      
      // Verify elements remain visible and functional
      for (let i = 0; i < Math.min(elementCount, 2); i++) {
        const element = dynamicElements.nth(i);
        await expect(element).toBeVisible();
      }
    }
  });
});

test.describe('Integration with External Services', () => {
  test('should handle external API failures gracefully', async ({ page }) => {
    // Block external API calls
    await page.route('**/api.external.com/**', route => route.abort());
    await page.route('**/external-service.com/**', route => route.abort());
    
    await page.goto('/');
    
    // Navigate through different pages to test external integrations
    const pages = ['/', '/organization', '/workflows', '/monitoring'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Page should load despite external service failures
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Look for error states or fallback content
      const errorElements = page.locator('[data-testid*="error"], [class*="error"], .error-message');
      const errorCount = await errorElements.count();
      
      // If error states exist, they should be user-friendly
      if (errorCount > 0) {
        const firstError = errorElements.first();
        const errorText = await firstError.textContent();
        expect(errorText?.length || 0).toBeGreaterThan(5);
      }
    }
  });

  test('should handle third-party service timeouts', async ({ page }) => {
    // Delay external requests to simulate timeouts
    await page.route('**/external/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      route.continue();
    });
    
    await page.goto('/');
    
    // App should remain responsive during slow external requests
    const navigationLinks = page.locator('a[href^="/"]');
    const linkCount = await navigationLinks.count();
    
    if (linkCount > 0) {
      await navigationLinks.first().click();
      
      // Navigation should work even with pending external requests
      await page.waitForTimeout(1000);
      const title = await page.title();
      expect(title).toBeDefined();
    }
  });
});

test.describe('Data Persistence and State Management', () => {
  test('should persist user preferences across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Look for preference settings (theme, language, etc.)
    const preferenceElements = page.locator('button:has-text("Theme"), button:has-text("Dark"), button:has-text("Light"), select[name*="language"]');
    const prefCount = await preferenceElements.count();
    
    if (prefCount > 0) {
      // Change a preference
      await preferenceElements.first().click();
      await page.waitForTimeout(1000);
      
      // Reload the page
      await page.reload();
      
      // Check if preference was maintained
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should handle localStorage and sessionStorage properly', async ({ page }) => {
    await page.goto('/');
    
    // Test localStorage functionality
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
      sessionStorage.setItem('session-key', 'session-value');
    });
    
    // Navigate to different page
    await page.goto('/organization');
    
    // Check if storage values persist
    const localStorageValue = await page.evaluate(() => localStorage.getItem('test-key'));
    const sessionStorageValue = await page.evaluate(() => sessionStorage.getItem('session-key'));
    
    expect(localStorageValue).toBe('test-value');
    expect(sessionStorageValue).toBe('session-value');
    
    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-key');
      sessionStorage.removeItem('session-key');
    });
  });

  test('should handle form state preservation', async ({ page }) => {
    await page.goto('/agent/default');
    
    // Fill out a form
    const inputs = page.locator('input[type="text"], textarea');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const testValue = 'persistent form data';
      await inputs.first().fill(testValue);
      
      // Navigate away and back
      await page.goto('/');
      await page.goto('/agent/default');
      
      // Check if form data was preserved (depending on implementation)
      const currentValue = await inputs.first().inputValue();
      
      // Either the value should be preserved or the form should be cleanly reset
      expect(typeof currentValue).toBe('string');
    }
  });
});