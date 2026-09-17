export const STORAGE_KEYS = {
  matches: 'sportmate_matches',
  joined: 'sportmate_joined',
  messages: 'sportmate_messages',
  notifications: 'sportmate_notifications',
} as const

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}
