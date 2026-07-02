// Persist user settings (e.g. Sonic Mode) to localStorage.

const STORAGE_KEY = 'holdem-gto-trainer:settings:v1'

export const DEFAULT_SETTINGS = {
  sonicMode: false,
  tableFormat: '6max',
  rakeProfile: '200nl',
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore storage errors.
  }
}
