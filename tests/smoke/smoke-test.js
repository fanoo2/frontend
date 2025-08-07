#!/usr/bin/env node

/**
 * Smoke Test Script
 * 
 * This script performs basic smoke tests to ensure the application
 * is functioning correctly after deployment.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');

// Test configuration
const CONFIG = {
  BUILD_TIMEOUT: 120000,     // 2 minutes for build
  SERVER_TIMEOUT: 30000,     // 30 seconds for server start
  HEALTH_TIMEOUT: 10000,     // 10 seconds for health check
  CLEANUP_TIMEOUT: 5000,     // 5 seconds for cleanup
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost'
};

class SmokeTest {
  constructor() {
    this.serverProcess = null;
    this.results = {
      build: false,
      server: false,
      healthCheck: false,
      cleanup: false
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📘',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type] || 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      this.log(`Running: ${command} ${args.join(' ')}`);
      const process = spawn(command, args, {
        cwd: ROOT_DIR,
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });

      let stdout = '';
      let stderr = '';

      if (options.silent) {
        process.stdout?.on('data', (data) => {
          stdout += data.toString();
        });
        process.stderr?.on('data', (data) => {
          stderr += data.toString();
        });
      }

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });

      // Handle timeout
      if (options.timeout) {
        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error(`Command timed out after ${options.timeout}ms`));
        }, options.timeout);
      }
    });
  }

  async buildProject() {
    this.log('🏗️ Building project...');
    try {
      await this.runCommand('npm', ['run', 'build'], {
        timeout: CONFIG.BUILD_TIMEOUT
      });
      this.results.build = true;
      this.log('Build successful!', 'success');
      return true;
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      return false;
    }
  }

  async startServer() {
    this.log('🚀 Starting server...');
    return new Promise((resolve, reject) => {
      // For frontend apps, we use preview mode after build
      this.serverProcess = spawn('npm', ['run', 'preview'], {
        cwd: ROOT_DIR,
        stdio: 'pipe',
        env: { ...process.env, PORT: CONFIG.PORT }
      });

      let serverStarted = false;
      const timeout = setTimeout(() => {
        if (!serverStarted) {
          this.serverProcess?.kill('SIGTERM');
          reject(new Error('Server start timeout'));
        }
      }, CONFIG.SERVER_TIMEOUT);

      this.serverProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        this.log(`Server: ${output.trim()}`);
        
        // Look for server ready indicators
        if (output.includes('Local:') || output.includes('server running') || output.includes(`${CONFIG.PORT}`)) {
          if (!serverStarted) {
            serverStarted = true;
            clearTimeout(timeout);
            this.results.server = true;
            this.log('Server started successfully!', 'success');
            resolve(true);
          }
        }
      });

      this.serverProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        this.log(`Server Error: ${output.trim()}`, 'warning');
      });

      this.serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.serverProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (!serverStarted) {
          reject(new Error(`Server process exited with code ${code}`));
        }
      });
    });
  }

  async checkHealth() {
    this.log('🏥 Performing health check...');
    
    const healthUrls = [
      `http://${CONFIG.HOST}:${CONFIG.PORT}/health`,
      `http://${CONFIG.HOST}:${CONFIG.PORT}/api/health`
    ];

    for (const url of healthUrls) {
      try {
        this.log(`Checking: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SmokeTest/1.0'
          },
          signal: AbortSignal.timeout(CONFIG.HEALTH_TIMEOUT)
        });

        this.log(`Health check response: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const data = await response.json();
          this.log(`Health check data: ${JSON.stringify(data)}`);
          
          // Check for expected health response
          if (data && (data.status === 'healthy' || data.healthy === true || data.status === 'ok')) {
            this.results.healthCheck = true;
            this.log('Health check passed!', 'success');
            return true;
          }
        }
      } catch (error) {
        this.log(`Health check failed for ${url}: ${error.message}`, 'warning');
      }
    }

    // If API health checks fail, try basic connectivity
    try {
      const response = await fetch(`http://${CONFIG.HOST}:${CONFIG.PORT}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(CONFIG.HEALTH_TIMEOUT)
      });

      if (response.ok) {
        this.log('Basic connectivity check passed', 'success');
        this.results.healthCheck = true;
        return true;
      }
    } catch (error) {
      this.log(`Basic connectivity failed: ${error.message}`, 'error');
    }

    this.log('All health checks failed', 'error');
    return false;
  }

  async cleanup() {
    this.log('🧹 Cleaning up...');
    try {
      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        
        // Give the process time to gracefully shut down
        await new Promise(resolve => {
          const timeout = setTimeout(() => {
            this.serverProcess?.kill('SIGKILL');
            resolve(undefined);
          }, CONFIG.CLEANUP_TIMEOUT);

          this.serverProcess?.on('close', () => {
            clearTimeout(timeout);
            resolve(undefined);
          });
        });
      }
      
      this.results.cleanup = true;
      this.log('Cleanup completed!', 'success');
      return true;
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateReport() {
    this.log('\n📊 SMOKE TEST RESULTS:');
    this.log('─'.repeat(50));
    
    const tests = [
      { name: 'Build', result: this.results.build },
      { name: 'Server Start', result: this.results.server },
      { name: 'Health Check', result: this.results.healthCheck },
      { name: 'Cleanup', result: this.results.cleanup }
    ];

    tests.forEach(test => {
      const status = test.result ? '✅ PASS' : '❌ FAIL';
      this.log(`${test.name.padEnd(15)} ${status}`);
    });

    const passed = tests.filter(test => test.result).length;
    const total = tests.length;
    
    this.log('─'.repeat(50));
    this.log(`Total: ${passed}/${total} tests passed`);

    // Write results to file for CI/CD
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      passed,
      total,
      success: passed === total
    };

    try {
      writeFileSync(join(ROOT_DIR, 'smoke-test-results.json'), JSON.stringify(report, null, 2));
      this.log('Results written to smoke-test-results.json');
    } catch (error) {
      this.log(`Failed to write results: ${error.message}`, 'warning');
    }

    return report.success;
  }

  async run() {
    this.log('🚀 Starting Smoke Tests...');
    this.log(`Configuration: Host=${CONFIG.HOST}, Port=${CONFIG.PORT}`);
    
    let success = false;
    
    try {
      // Step 1: Build the project
      if (!await this.buildProject()) {
        throw new Error('Build failed');
      }

      // Step 2: Start the server
      if (!await this.startServer()) {
        throw new Error('Server start failed');
      }

      // Wait a moment for server to fully initialize
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Health check
      if (!await this.checkHealth()) {
        throw new Error('Health check failed');
      }

      success = true;
      this.log('🎉 All smoke tests passed!', 'success');

    } catch (error) {
      this.log(`💥 Smoke tests failed: ${error.message}`, 'error');
    } finally {
      // Step 4: Cleanup
      await this.cleanup();
      
      // Generate final report
      const allPassed = this.generateReport();
      
      // Exit with appropriate code
      process.exit(allPassed ? 0 : 1);
    }
  }
}

// Run smoke tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const smokeTest = new SmokeTest();
  smokeTest.run().catch(error => {
    console.error('Smoke test runner failed:', error);
    process.exit(1);
  });
}

export default SmokeTest;