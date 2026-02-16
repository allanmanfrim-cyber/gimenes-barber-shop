import { db } from '../database/init.js'

interface PaymentSetting {
  id: number
  setting_key: string
  setting_value: string | null
  updated_at: string
}

export const PaymentSettingsModel = {
  get(key: string): string | null {
    const row = db.prepare('SELECT setting_value FROM payment_settings WHERE setting_key = ?').get(key) as { setting_value: string | null } | undefined
    return row?.setting_value || null
  },

  set(key: string, value: string | null): void {
    const existing = db.prepare('SELECT id FROM payment_settings WHERE setting_key = ?').get(key)
    if (existing) {
      db.prepare('UPDATE payment_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?').run(value, key)
    } else {
      db.prepare('INSERT INTO payment_settings (setting_key, setting_value) VALUES (?, ?)').run(key, value)
    }
  },

  getAll(): Record<string, string | null> {
    const rows = db.prepare('SELECT setting_key, setting_value FROM payment_settings').all() as PaymentSetting[]
    const settings: Record<string, string | null> = {}
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value
    }
    return settings
  },

  setMultiple(settings: Record<string, string | null>): void {
    const insertOrUpdate = db.prepare(`
      INSERT INTO payment_settings (setting_key, setting_value) 
      VALUES (?, ?)
      ON CONFLICT(setting_key) 
      DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP
    `)
    
    const transaction = db.transaction((entries: [string, string | null][]) => {
      for (const [key, value] of entries) {
        insertOrUpdate.run(key, value)
      }
    })
    
    transaction(Object.entries(settings))
  }
}
