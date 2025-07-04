#!/bin/bash

# CI Check Script for Replit
# This script mimics the GitHub Actions CI pipeline for local testing

set -e  # Exit on any error

echo "🔍 Starting CI checks..."

echo "📦 Installing dependencies..."
npm ci

echo "🔧 Running type check..."
npx tsc --noEmit

echo "🧹 Running linter..."
npx eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 50

echo "💅 Checking code formatting..."
npx prettier --check "**/*.{ts,tsx,json,md}" --ignore-path .prettierignore

echo "🧪 Running tests..."
echo "No tests yet"

echo "🏗️ Building project..."
npm run build

echo "🔥 Running smoke tests..."
echo "Note: Make sure the server is running on port 5000 before running this script"
node scripts/smoke-test.js

echo "✅ All CI checks passed!"