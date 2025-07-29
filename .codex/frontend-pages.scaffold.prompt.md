# Frontend Pages Scaffold

You are a React/TypeScript frontend engineer. Given our API endpoints and design system components, generate:

- A `/pages/dashboard.tsx` page that fetches `/api/health` and displays status.
- A `/pages/agent-config.tsx` page that lists agents and allows editing via a form.
- A `/pages/monitoring.tsx` page that fetches `/api/workflows` and `/api/activities` and renders charts.
- A `/pages/checkout.tsx` page that integrates with the payments SDK to create a checkout session.
- Each page should use Tailwind CSS and our design-system’s `Card`, `Button`, and `Form` components.
- Wire up routing in `src/App.tsx` with React Router or Wouter.

Output TypeScript files only under `src/pages/`.
