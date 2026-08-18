// In the browser (Next.js dev/start server), relative "/api/*" and "/ready"
// paths go through the rewrites in next.config.ts to reach the backend.
// A static export (Capacitor) has no server to apply those rewrites, so the
// build must be given a real backend origin via NEXT_PUBLIC_API_BASE_URL
// (see MOBILE_BUILD.md).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function apiPath(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}/v1${path}` : `/api${path}`;
}

export function readyPath(): string {
  return API_BASE_URL ? `${API_BASE_URL}/ready` : "/ready";
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiPath(path), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}
