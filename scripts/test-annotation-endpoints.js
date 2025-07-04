#!/usr/bin/env node

/**
 * Test script to demonstrate both annotation endpoints
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function testSimpleAnnotate() {
  console.log('🔍 Testing simple annotation endpoint...');
  
  const response = await fetch(`${BASE_URL}/api/annotate-simple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: 'Build a microservice with REST API' }),
  });

  const data = await response.json();
  console.log('✅ Simple annotation results:');
  data.annotations.forEach((annotation, index) => {
    console.log(`   ${index + 1}. ${annotation}`);
  });
  console.log();
}

async function testAdvancedAnnotate() {
  console.log('🔍 Testing advanced annotation endpoint...');
  
  const response = await fetch(`${BASE_URL}/api/annotate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: 'Implement AI agent workflow automation system' }),
  });

  const data = await response.json();
  console.log('✅ Advanced annotation results:');
  data.annotations.forEach((annotation, index) => {
    console.log(`   ${index + 1}. ${annotation}`);
  });
  console.log();
}

async function runTests() {
  console.log('🚀 Testing annotation endpoints...\n');
  
  try {
    await testSimpleAnnotate();
    await testAdvancedAnnotate();
    console.log('🎉 All annotation tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();