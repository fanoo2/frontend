
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for safe JSON parsing
function safeJsonResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response is not JSON - likely received HTML error page');
  }
  return response.json();
}

// Core endpoints (no `/api` prefix)
export const HEALTH   = `${API}/health`;
export const AGENTS   = `${API}/agents`;
export const AGENT    = (id: number) => `${API}/agents/${id}`;
export const ANNOTATE = `${API}/annotate`;

// API prefixed routes
export const API_STATS    = `${API}/api/stats`;
export const API_ANNOTATE = `${API}/api/annotate`;
export const API_SIMPLE   = `${API}/api/annotate-simple`;
export const API_ANNOTATIONS = `${API}/api/annotations`;
export const API_PHASES      = `${API}/api/phases`;
export const API_REPOS       = `${API}/api/repositories`;
export const API_SERVICES    = `${API}/api/services`;
export const API_ACTIVITIES  = (limit?: number) =>
  `${API}/api/activities${limit ? `?limit=${limit}` : ''}`;
export const API_WORKFLOWS   = `${API}/api/workflows`;

// API functions using the centralized endpoints
export function fetchAgents() {
  return fetch(AGENTS).then(safeJsonResponse);
}

export function fetchHealth() {
  return fetch(HEALTH).then(safeJsonResponse);
}

export function annotateText(text: string) {
  return fetch(API_ANNOTATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then(res => res.json());
}

export function getAgent(id: number) {
  return fetch(AGENT(id)).then(res => res.json());
}

export function updateAgent(id: number, data: any) {
  return fetch(AGENT(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

// Additional API functions for new endpoints
export function fetchStats() {
  return fetch(API_STATS).then(res => res.json());
}

export function fetchAnnotations(limit?: number) {
  return fetch(`${API_ANNOTATIONS}${limit ? `?limit=${limit}` : ''}`).then(res => res.json());
}

export function fetchPhases() {
  return fetch(API_PHASES).then(res => res.json());
}

export function fetchRepositories() {
  return fetch(API_REPOS).then(res => res.json());
}

export function fetchServices() {
  return fetch(API_SERVICES).then(res => res.json());
}

export function fetchActivities(limit?: number) {
  return fetch(API_ACTIVITIES(limit)).then(res => res.json());
}

export function fetchWorkflows() {
  return fetch(API_WORKFLOWS).then(res => res.json());
}

export function annotateSimple(text: string) {
  return fetch(API_SIMPLE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then(res => res.json());
}

// Generic API client
export const apiClient = {
  baseURL: API,
  fetch: (endpoint: string, options?: RequestInit) => {
    return fetch(`${API}${endpoint}`, options);
  }
};
