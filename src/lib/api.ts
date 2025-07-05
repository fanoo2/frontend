
const API = import.meta.env.VITE_API_URL;

export function fetchAgents() {
  return fetch(`${API}/agents`).then(res => res.json());
}

export function fetchHealth() {
  return fetch(`${API}/api/health`).then(res => res.json());
}

export function annotateText(text: string) {
  return fetch(`${API}/api/annotate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then(res => res.json());
}

export function getAgent(id: number) {
  return fetch(`${API}/agents/${id}`).then(res => res.json());
}

export function updateAgent(id: number, data: any) {
  return fetch(`${API}/agents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

// Add more API functions as needed
export const apiClient = {
  baseURL: API,
  fetch: (endpoint: string, options?: RequestInit) => {
    return fetch(`${API}${endpoint}`, options);
  }
};
