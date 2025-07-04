#!/usr/bin/env node

/**
 * Smoke Test Script for Fanno Platform API
 * 
 * This script verifies that the essential API endpoints are working correctly:
 * 1. Health check endpoint
 * 2. Text annotation endpoint with sample data
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testHealthEndpoint() {
  console.log('🔍 Testing health endpoint...');
  
  const result = await makeRequest(`${BASE_URL}/api/health`);
  
  if (!result.success) {
    throw new Error(`Health check failed: ${result.error || result.status}`);
  }
  
  if (result.data.status !== 'healthy') {
    throw new Error(`Health check returned unexpected status: ${result.data.status}`);
  }
  
  console.log('✅ Health check passed');
  return result.data;
}

async function testAnnotateEndpoint() {
  console.log('🔍 Testing annotation endpoint...');
  
  const testText = "Hello world";
  const result = await makeRequest(`${BASE_URL}/api/annotate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: testText }),
  });
  
  if (!result.success) {
    throw new Error(`Annotation endpoint failed: ${result.error || result.status}`);
  }
  
  if (!result.data.annotations || !Array.isArray(result.data.annotations)) {
    throw new Error('Annotation endpoint did not return annotations array');
  }
  
  if (result.data.annotations.length === 0) {
    throw new Error('Annotation endpoint returned empty annotations array');
  }
  
  console.log(`✅ Annotation endpoint passed - returned ${result.data.annotations.length} annotations`);
  return result.data;
}

async function runSmokeTests() {
  console.log('🚀 Starting smoke tests...');
  console.log(`📍 Testing against: ${BASE_URL}`);
  
  try {
    // Test health endpoint
    await testHealthEndpoint();
    
    // Test annotation endpoint
    await testAnnotateEndpoint();
    
    console.log('🎉 All smoke tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Smoke tests failed:', error.message);
    process.exit(1);
  }
}

// Add a delay function for retries
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced test runner with retries
async function runSmokeTestsWithRetries(maxRetries = 3, retryDelay = 2000) {
  console.log('🚀 Starting smoke tests with retry capability...');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📍 Attempt ${attempt}/${maxRetries} - Testing against: ${BASE_URL}`);
      
      await testHealthEndpoint();
      await testAnnotateEndpoint();
      
      console.log('🎉 All smoke tests passed!');
      return;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay/1000} seconds...`);
        await delay(retryDelay);
      }
    }
  }
  
  console.error('💥 All smoke test attempts failed');
  process.exit(1);
}

// Run tests based on command line arguments
if (process.argv.includes('--retry')) {
  runSmokeTestsWithRetries();
} else {
  runSmokeTests();
}