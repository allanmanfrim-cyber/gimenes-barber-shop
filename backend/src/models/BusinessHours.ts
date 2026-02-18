import { db } from '../database/init.js'

export interface BusinessHours {
  id: number
  day_of_week: number
  open_time: string
  close_time: string
  is_open: number
}

export const BusinessHoursModel = {
  findAll: (): BusinessHours[] => {
    return db.prepare('SELECT * FROM business_hours ORDER BY day_of_week').all() as BusinessHours[]
  },

  findByDay: (dayOfWeek: number): BusinessHours | undefined => {
    return db.prepare('SELECT * FROM business_hours WHERE day_of_week = ?').get(dayOfWeek) as BusinessHours | undefined
  },

  update: (dayOfWeek: number, data: Partial<BusinessHours>): BusinessHours | undefined => {
    const fields: string[] = []
    const values: (string | number)[] = []

    if (data.open_time !== undefined) { fields.push('open_time = ?'); values.push(data.open_time) }
    if (data.close_time !== undefined) { fields.push('close_time = ?'); values.push(data.close_time) }
    if (data.is_open !== undefined) { fields.push('is_open = ?'); values.push(data.is_open) }

    if (fields.length === 0) return BusinessHoursModel.findByDay(dayOfWeek)

    values.push(dayOfWeek)
    db.prepare(`UPDATE business_hours SET ${fields.join(', ')} WHERE day_of_week = ?`).run(...values)
    return BusinessHoursModel.findByDay(dayOfWeek)
  },

  updateAll: (hours: BusinessHours[]): void => {
    const update = db.prepare(`
      UPDATE business_hours SET open_time = ?, close_time = ?, is_open = ? WHERE day_of_week = ?
    `)
    
    for (const h of hours) {
      update.run(h.open_time, h.close_time, h.is_open, h.day_of_week)
    }
  }
}
