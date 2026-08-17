const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  health: () => request('/health/ready'),
  natal: (payload) => request('/v1/natal/compute', { method: 'POST', body: JSON.stringify(payload) }),
  transitNow: (params) => request(`/v1/transit/now?${new URLSearchParams(params)}`),
  synastry: (a, b) => request('/v1/synastry/cross-aspects', { method: 'POST', body: JSON.stringify({ a, b }) }),
  branches: {
    list: () => request('/v1/branches/list'),
    get: (slug) => request(`/v1/branches/${slug}`),
  },
  payments: {
    checkout: (payload) => request('/v1/payments/checkout', { method: 'POST', body: JSON.stringify(payload) }),
  },
  auth: {
    signup: (payload) => request('/v1/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/v1/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  },
};
