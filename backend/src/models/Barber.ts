import { db } from '../database/init.js'

export interface Barber {
  id: number
  name: string
  whatsapp: string | null
  email: string | null
  active: number
  created_at: string
}

export const BarberModel = {
  findAll: (activeOnly = true): Barber[] => {
    const query = activeOnly
      ? 'SELECT * FROM barbers WHERE active = 1 ORDER BY name'
      : 'SELECT * FROM barbers ORDER BY name'
    return db.prepare(query).all() as Barber[]
  },

  findById: (id: number): Barber | undefined => {
    return db.prepare('SELECT * FROM barbers WHERE id = ?').get(id) as Barber | undefined
  },

  create: (name: string, whatsapp?: string, email?: string): Barber => {
    const result = db.prepare('INSERT INTO barbers (name, whatsapp, email) VALUES (?, ?, ?)').run(name, whatsapp || null, email || null)
    return BarberModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Barber>): Barber | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(data.whatsapp) }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email) }
    if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active) }

    if (fields.length === 0) return BarberModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE barbers SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return BarberModel.findById(id)
  }
}
