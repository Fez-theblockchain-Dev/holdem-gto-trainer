// Persist played-hand history to localStorage, namespaced per signed-in user so
// each account tracks its own hands played. Falls back to a "guest" bucket when
// no user id is available.

const BASE_KEY = 'holdem-gto-trainer:history'

function keyFor(userId) {
  return `${BASE_KEY}:${userId || 'guest'}:v1`
}

export function loadHistory(userId) {
  try {
    const raw = localStorage.getItem(keyFor(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(userId, history) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(history))
  } catch {
    // Ignore storage errors (e.g. private mode / quota).
  }
}

export function clearHistory(userId) {
  try {
    localStorage.removeItem(keyFor(userId))
  } catch {
    // Ignore.
  }
}
