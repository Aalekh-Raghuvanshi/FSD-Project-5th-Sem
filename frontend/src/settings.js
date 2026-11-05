export const settingsStorageKey = 'carepoint-settings'

export const defaultSettings = {
  hospitalName: 'CarePoint General Hospital',
  hospitalEmail: 'hello@carepoint.example.test',
  hospitalPhone: '555-0100',
  hospitalAddress: '100 Wellness Avenue, Greenfield',
  adminName: 'Admin',
  adminEmail: 'admin@carepoint.example.test',
}

export function readSettings() {
  try {
    const storedSettings = JSON.parse(localStorage.getItem(settingsStorageKey) || '{}')
    return Object.fromEntries(Object.keys(defaultSettings).map((key) => [key, storedSettings[key] ?? defaultSettings[key]]))
  } catch {
    return { ...defaultSettings }
  }
}
