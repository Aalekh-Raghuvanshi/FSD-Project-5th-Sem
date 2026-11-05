export const settingsStorageKey = 'carepoint-settings'

export const defaultSettings = {
  hospitalName: 'CarePoint General Hospital',
  hospitalEmail: 'hello@carepoint.example.test',
  hospitalPhone: '555-0100',
  hospitalAddress: '100 Wellness Avenue, Greenfield',
  adminName: 'Admin Kumar',
  adminEmail: 'admin@carepoint.example.test',
  reportRange: '30',
  compactTables: false,
  showHealthAlerts: true,
}

export function readSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(settingsStorageKey) || '{}') }
  } catch {
    return { ...defaultSettings }
  }
}
