# Frontend CI/CD Enhancement

This document describes the enhanced CI/CD pipeline implemented for the frontend project.

## 🚀 Features Implemented

### 1. Enhanced CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

The CI/CD pipeline now includes comprehensive checks that run on every push and pull request:

- **TypeScript Compilation**: Runs `npm run check` to validate TypeScript code
- **Code Linting**: Runs `npm run lint` with ESLint to ensure code quality
- **Build Process**: Compiles the application for production
- **End-to-End Testing**: Runs Playwright tests to verify functionality
- **Fail Fast**: Pipeline fails early if any step encounters errors

### 2. End-to-End Testing with Playwright

**Configuration**: `playwright.config.ts`
**Tests**: `tests/dashboard.spec.ts`

Smoke tests include:
- Dashboard page loading verification
- Navigation elements testing
- Backend API call handling (graceful failure when backend unavailable)
- Console error monitoring
- React hydration verification

**Commands**:
```bash
npm run test:e2e         # Run tests headlessly
npm run test:e2e:ui      # Run tests with UI
```

### 3. Repository Dispatch Automation (`.github/workflows/auto-trigger-agent.yml`)

Automatically triggers the `run-frontend-agent.yml` workflow when the payments service publishes a new SDK version.

**Trigger**: Repository dispatch event with type `payments-sdk-update`
**Payload**: `{ "sdk_version": "1.2.3" }`

**Example trigger**:
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/fanoo2/frontend/dispatches \
  -d '{"event_type":"payments-sdk-update","client_payload":{"sdk_version":"1.2.3"}}'
```

### 4. Deployment Pipeline (`.github/workflows/deploy.yml`)

Comprehensive deployment workflow that supports multiple strategies:

#### Docker + Kubernetes/Helm
- Builds Docker image with nginx
- Pushes to GitHub Container Registry (GHCR)
- Provides examples for kubectl and Helm deployment

#### Vercel Deployment
- Optional Vercel deployment (enabled with `DEPLOY_TO_VERCEL=true` variable)
- Requires secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

**Deployment triggers after successful CI/CD completion**

## 🛠️ Code Quality

### Linting Configuration (`eslint.config.js`)
- TypeScript + React rules
- Maximum 50 warnings allowed (configurable)
- Excludes generated files and build artifacts
- Warns on `any` types, unused variables, and React patterns

### TypeScript Configuration
- Strict type checking enabled
- No emit compilation (Vite handles building)
- Path aliases configured (`@/*` for `src/*`)

## 📁 Project Structure

```
.github/workflows/
├── ci-cd.yml              # Main CI/CD pipeline
├── auto-trigger-agent.yml # Repository dispatch automation
├── deploy.yml             # Deployment pipeline
└── run-frontend-agent.yml # Existing SDK update workflow

tests/
└── dashboard.spec.ts      # End-to-end smoke tests

eslint.config.js           # ESLint configuration
playwright.config.ts       # Playwright test configuration
```

## 🎯 Usage

### Local Development
```bash
npm ci                     # Install dependencies
npm run dev               # Start development server
npm run check             # Run TypeScript check
npm run lint              # Run linting
npm run lint:fix          # Fix auto-fixable lint issues
npm run build             # Build for production
npm run test:e2e          # Run end-to-end tests
```

### CI/CD Triggers
- **Push to main**: Runs full CI/CD + deployment
- **Pull requests**: Runs CI/CD without deployment
- **Repository dispatch**: Triggers agent workflow with SDK updates

### Deployment
The deployment workflow provides multiple options:

1. **Docker + GHCR**: Ready for Kubernetes/Helm deployment
2. **Vercel**: Direct deployment to Vercel platform
3. **Custom**: Easy to extend for other platforms

## 🔧 Configuration

### Environment Variables
- `DEPLOY_TO_VERCEL`: Enable Vercel deployment (set to `'true'`)

### Required Secrets (for Vercel)
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### GitHub Permissions
The workflows use `GITHUB_TOKEN` with these permissions:
- `contents: read` - Read repository contents
- `packages: write` - Push to GitHub Container Registry

## 🚦 Status Indicators

All workflows include proper status reporting and artifact uploads:
- **CI/CD**: Uploads Playwright test reports
- **Deployment**: Shows deployment examples and next steps
- **Repository Dispatch**: Logs triggered actions

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Fix compilation errors shown by `npm run check`
2. **Lint Warnings**: Reduce warnings or adjust max-warnings in package.json
3. **E2E Test Failures**: Check Playwright reports in CI artifacts
4. **Deployment Issues**: Verify secrets and permissions for target platform

### Local Testing
Always test locally before pushing:
```bash
npm run check && npm run lint && npm run build && npm run test:e2e
```

This matches the exact CI pipeline steps.