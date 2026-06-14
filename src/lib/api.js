// src/lib/api.js
// ─── Server + client fetch helpers for the Athlofit backend ──────────────────

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://athlofit-backend.vercel.app';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://athlofit.com';

/**
 * Server-side fetch with ISR support.
 * @param {string} path - API path beginning with "/"
 * @param {object} options
 * @param {number} [options.revalidate=60] - ISR revalidation window in seconds
 * @param {object} [options.headers]
 * @param {boolean} [options.noStore] - disable caching (always fresh)
 */
export async function apiGet(path, { revalidate = 60, headers = {}, noStore = false } = {}) {
  const url = `${API_URL}${path}`;
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(noStore ? { cache: 'no-store' } : { next: { revalidate } }),
  };

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const err = new Error(`API ${res.status} for ${path}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  // Backend wraps responses as { success, message, data }
  return json.data !== undefined ? json.data : json;
}

/**
 * Safe variant — returns fallback instead of throwing (for non-critical data).
 */
export async function apiGetSafe(path, fallback = null, opts = {}) {
  try {
    return await apiGet(path, opts);
  } catch {
    return fallback;
  }
}

/**
 * Client-side POST (used in browser components for auth, orders, etc.)
 */
export async function apiPost(path, body, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json.data !== undefined ? json.data : json;
}
