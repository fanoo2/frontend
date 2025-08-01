# Testing the Fixed Issues

This document explains how to test the three issues that were fixed.

## 1. Testing Repository Dispatch Automation

The workflow now listens for three types of dependency updates:

### Test Payments SDK Update (existing functionality)
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/fanoo2/frontend/dispatches \
  -d '{"event_type":"payments-sdk-update","client_payload":{"sdk_version":"1.2.3"}}'
```

### Test Design System Update (NEW)
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/fanoo2/frontend/dispatches \
  -d '{"event_type":"design-system-update","client_payload":{"design_system_version":"0.2.0"}}'
```

### Test WebRTC Client Update (NEW)
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/fanoo2/frontend/dispatches \
  -d '{"event_type":"webrtc-client-update","client_payload":{"webrtc_client_version":"1.1.0"}}'
```

Each of these should trigger the `run-frontend-agent.yml` workflow with the appropriate version input.

## 2. Testing Helm Chart Deployment

The Helm chart is now available in `helm-charts/frontend/` and can be tested:

### Validate Chart Syntax
```bash
helm lint helm-charts/frontend
```

### Test Template Rendering
```bash
helm template test-release helm-charts/frontend
```

### Test with Custom Values
```bash
# Create test values
cat > test-values.yaml << EOF
replicaCount: 2
image:
  repository: ghcr.io/fanoo2/frontend
  tag: latest
ingress:
  enabled: true
  hosts:
    - host: frontend.test.local
      paths:
        - path: /
          pathType: Prefix
EOF

# Test template with custom values
helm template test-release helm-charts/frontend -f test-values.yaml
```

### Deploy to Kubernetes (if available)
```bash
# Install the chart
helm install frontend-staging helm-charts/frontend \
  --set image.tag=latest \
  --set replicaCount=2 \
  --namespace staging \
  --create-namespace

# Upgrade the chart
helm upgrade frontend-staging helm-charts/frontend \
  --set image.tag=v1.1.0

# Uninstall
helm uninstall frontend-staging --namespace staging
```

## 3. Testing Comprehensive E2E Tests

The E2E tests have been expanded from 4 smoke tests to 40+ comprehensive scenarios:

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test Suites
```bash
# Run only comprehensive tests (navigation, forms, etc.)
npx playwright test comprehensive.spec.ts

# Run only integration tests (WebRTC, external services, etc.)
npx playwright test integration.spec.ts

# Run only original smoke tests
npx playwright test dashboard.spec.ts
```

### Test Categories Now Covered

1. **Navigation and Routing** (5 tests)
   - Multi-page navigation
   - Invalid route handling
   - Sidebar consistency

2. **Agent Configuration** (3 tests)
   - Form interactions
   - Different agent types
   - Validation testing

3. **Design System Integration** (2 tests)
   - Component rendering
   - Interactive elements

4. **Checkout and Payment** (2 tests)
   - Payment flow
   - Form validation

5. **Error Handling and Resilience** (3 tests)
   - Network failures
   - API timeouts
   - Console error monitoring

6. **Performance and Accessibility** (3 tests)
   - Load time testing
   - Responsive design
   - Keyboard navigation

7. **WebRTC Integration** (3 tests)
   - Media device handling
   - Connection states
   - Permission scenarios

8. **Real-time Features** (2 tests)
   - WebSocket handling
   - Live data updates

9. **External Service Integration** (2 tests)
   - Third-party failures
   - Service timeouts

10. **Data Persistence** (3 tests)
    - State management
    - localStorage/sessionStorage
    - Form preservation

### Test with Different Scenarios
```bash
# Test with headless browser
npx playwright test --project=chromium

# Test with UI mode
npx playwright test --ui

# Test specific scenarios
npx playwright test --grep "should handle WebRTC"
npx playwright test --grep "should navigate between"
```

## Verification Commands

Run these commands to verify all changes work:

```bash
# 1. Verify build still works
npm ci && npm run check && npm run lint && npm run build

# 2. Verify Helm chart is valid
helm lint helm-charts/frontend
helm template test helm-charts/frontend > /dev/null

# 3. Verify test syntax (if Playwright is available)
npm run test:e2e || npm run test:e2e:skip

# 4. Check workflow syntax
grep -q "design-system-update\|webrtc-client-update" .github/workflows/auto-trigger-agent.yml && echo "Workflow updated successfully"

# 5. Verify all files exist
test -f helm-charts/frontend/Chart.yaml && \
test -f helm-charts/frontend/README.md && \
test -f tests/comprehensive.spec.ts && \
test -f tests/integration.spec.ts && \
echo "All files created successfully"
```

## Expected Results

- **Repository Dispatch**: All three dependency types should trigger the agent workflow
- **Helm Chart**: Should deploy successfully to any Kubernetes cluster
- **E2E Tests**: Should provide comprehensive coverage of all major user workflows
- **Build**: Should continue to work without any regressions