/**
 * Client-side helpers for the /api/user-data serverless endpoint.
 * All calls require a Clerk session token passed as a Bearer header.
 * Errors are thrown so callers can decide whether to fall back to localStorage.
 */

//More clerk sign in/auth security checks
async function apiFetch(path, options = {}, token) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`${options.method ?? 'GET'} ${path} → ${res.status}`)
  return res.json()
}

export async function fetchUserData(token) {
  return apiFetch('/api/user-data', {}, token)
}

export async function saveUserData({ history, settings }, token) {
  const body = {}
  if (history !== undefined) body.history = history
  if (settings !== undefined) body.settings = settings
  return apiFetch('/api/user-data', { method: 'PUT', body: JSON.stringify(body) }, token)
}

export async function clearCloudHistory(token) {
  return apiFetch('/api/user-data', { method: 'DELETE' }, token)
}
