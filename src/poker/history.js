// Persist played-hand history to localStorage so stats survive refreshes.

const STORAGE_KEY = 'holdem-gto-trainer:history:v1'

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // Ignore storage errors (e.g. private mode / quota).
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore.
  }
}
