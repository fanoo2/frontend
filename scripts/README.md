# Scripts Documentation

This directory contains utility scripts for the Fanno Platform project.

## Available Scripts

### `smoke-test.js`
A comprehensive smoke test script that validates the core API functionality.

**Features:**
- Tests health endpoint (`/api/health`)
- Tests annotation endpoint (`/api/annotate`) with sample data
- Validates response structure and content
- Includes retry mechanism for unreliable environments

**Usage:**
```bash
# Basic usage (requires server running on port 5000)
node scripts/smoke-test.js

# With retry capability
node scripts/smoke-test.js --retry

# Custom base URL
BASE_URL=https://your-domain.com node scripts/smoke-test.js
```

**CI Integration:**
The script is integrated into the GitHub Actions CI pipeline and runs automatically after every build to ensure deployment quality.

### `ci-check.sh`
Local CI verification script that mimics the GitHub Actions pipeline.

**Usage:**
```bash
# Run all CI checks (requires server running for smoke tests)
bash scripts/ci-check.sh
```

**Includes:**
- Dependency installation
- TypeScript type checking
- ESLint code linting
- Prettier formatting verification
- Project build verification
- Smoke test execution

## Environment Variables

- `BASE_URL`: Base URL for API testing (default: `http://localhost:5000`)
- `NODE_ENV`: Environment mode (development/production)

## Notes

- Smoke tests require the server to be running on the specified port
- All scripts are designed to work in both local and CI environments
- Exit codes follow standard conventions (0 = success, 1 = failure)