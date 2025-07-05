#!/usr/bin/env node

/**
 * Test script comparing OpenAI vs basic annotation capabilities
 */

async function testAnnotationService() {
  const baseUrl = 'http://localhost:5000/api';

  const testCases = [
    {
      name: "Technical Platform Text",
      text: "The AI agent orchestration workflow needs better error handling and authentication mechanisms for the Fanno platform.",
    },
    {
      name: "Code Quality Issues",
      text: "The React frontend component is broken and needs urgent fixes. The database queries are slow and the authentication system has security vulnerabilities.",
    },
    {
      name: "Complex Technical Architecture",
      text: "We need to implement microservices with Docker containerization, Kubernetes orchestration, and implement OAuth2 authentication with JWT tokens for our API gateway.",
    },
    {
      name: "Business Requirements",
      text: "The payment processing system must comply with PCI DSS standards and integrate with Stripe for credit card transactions while maintaining high availability.",
    }
  ];

  console.log('🤖 Testing OpenAI-Powered Annotation Service...\n');

  for (const testCase of testCases) {
    console.log(`📋 Test: ${testCase.name}`);
    console.log(`Input: "${testCase.text}"`);

    try {
      const response = await fetch(`${baseUrl}/annotate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: testCase.text })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ OpenAI Analysis:');
        result.annotations.forEach((annotation, index) => {
          console.log(`   ${index + 1}. ${annotation}`);
        });
      } else {
        const error = await response.json();
        console.log(`❌ Error (${response.status}):`, error.message);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }

    console.log('');
  }

  // Test performance comparison
  console.log('⚡ Performance Test...\n');
  const perfText = "The agent workflow needs optimization for better performance and scalability in the cloud infrastructure.";

  const startTime = Date.now();
  try {
    const response = await fetch(`${baseUrl}/annotate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: perfText })
    });

    const endTime = Date.now();
    const result = await response.json();

    console.log(`✅ Response time: ${endTime - startTime}ms`);
    console.log(`✅ Annotations received: ${result.annotations.length}`);
    console.log('Sample annotation:', result.annotations[0]);
  } catch (error) {
    console.log('❌ Performance test failed:', error.message);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  testAnnotationService().catch(console.error);
}

module.exports = { testAnnotationService };
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// API constants for testing
const API_ANNOTATE = `${BASE_URL}/api/annotate`;

async function testOpenAIAnnotator() {
  console.log('🤖 Testing OpenAI-powered annotation endpoint...');

  const response = await fetch(API_ANNOTATE, {