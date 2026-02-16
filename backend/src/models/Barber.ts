import { db } from '../database/init.js'

export interface Barber {
  id: number
  name: string
  phone?: string
  photo_url?: string
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

  create: (name: string, phone?: string): Barber => {
    const result = db.prepare('INSERT INTO barbers (name, phone) VALUES (?, ?)').run(name, phone || null)
    return BarberModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Barber>): Barber | undefined => {
    const fields: string[] = []
    const values: (any)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.phone !== undefined) { fields.push('phone = ?'); values.push(data.phone) }
    if (data.photo_url !== undefined) { fields.push('photo_url = ?'); values.push(data.photo_url) }
    if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active) }

    if (fields.length === 0) return BarberModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE barbers SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return BarberModel.findById(id)
  },

  delete: (id: number): boolean => {
    const transaction = db.transaction(() => {
      // Deletar pagamentos associados aos agendamentos do barbeiro
      db.prepare(`
        DELETE FROM payments 
        WHERE appointment_id IN (SELECT id FROM appointments WHERE barber_id = ?)
      `).run(id)
      
      // Deletar agendamentos
      db.prepare('DELETE FROM appointments WHERE barber_id = ?').run(id)
      
      // Deletar usuario
      db.prepare('DELETE FROM users WHERE barber_id = ?').run(id)
      
      // Deletar barbeiro
      const result = db.prepare('DELETE FROM barbers WHERE id = ?').run(id)
      return result.changes > 0
    })

    return transaction()
  }
}
