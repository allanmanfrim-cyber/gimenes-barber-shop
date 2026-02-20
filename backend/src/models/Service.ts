import { db } from '../database/init.js'

export interface Service {
  id: number
  tenant_id: number
  name: string
  duration_minutes: number
  price: number
  active: number
  created_at: string
}

export const ServiceModel = {
  findAll: (activeOnly = true): Service[] => {
    const query = activeOnly
      ? 'SELECT * FROM services WHERE active = 1 ORDER BY name'
      : 'SELECT * FROM services ORDER BY name'
    return db.prepare(query).all() as Service[]
  },

  findById: (id: number): Service | undefined => {
    return db.prepare('SELECT * FROM services WHERE id = ?').get(id) as Service | undefined
  },

  create: (data: { name: string; duration_minutes: number; price: number }): Service => {
    const result = db.prepare(
      'INSERT INTO services (name, duration_minutes, price) VALUES (?, ?, ?)'
    ).run(data.name, data.duration_minutes, data.price)
    return ServiceModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Service>): Service | undefined => {
    const fields: string[] = []
    const values: (string | number)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.duration_minutes !== undefined) { fields.push('duration_minutes = ?'); values.push(data.duration_minutes) }
    if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price) }
    if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active) }

    if (fields.length === 0) return ServiceModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return ServiceModel.findById(id)
  },

  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM services WHERE id = ?').run(id)
    return result.changes > 0
  }
}

