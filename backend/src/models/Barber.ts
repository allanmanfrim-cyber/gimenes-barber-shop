import { db } from '../database/init.js'

export interface Barber {
  id: number
  tenant_id: number
  name: string
  whatsapp?: string
  email?: string
  active: number
  display_order: number
  created_at: string
}

export const BarberModel = {
  findAll: (activeOnly = true, tenantId: number = 1): Barber[] => {
    let query = activeOnly
      ? 'SELECT * FROM barbers WHERE active = 1 AND tenant_id = ?'
      : 'SELECT * FROM barbers WHERE tenant_id = ?'
    
    // Ordenacao explicita: display_order ASC (menor primeiro), depois nome
    query += ' ORDER BY display_order ASC, name ASC'
    
    return db.prepare(query).all(tenantId) as Barber[]
  },

  findById: (id: number): Barber | undefined => {
    return db.prepare('SELECT * FROM barbers WHERE id = ?').get(id) as Barber | undefined
  },

  create: (name: string, whatsapp?: string, email?: string): Barber => {
    const result = db.prepare('INSERT INTO barbers (name, whatsapp, email, tenant_id) VALUES (?, ?, ?, 1)').run(name, whatsapp || null, email || null)
    return BarberModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Barber>): Barber | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(data.whatsapp) }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email) }
    if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active) }
    if (data.display_order !== undefined) { fields.push('display_order = ?'); values.push(data.display_order) }

    if (fields.length === 0) return BarberModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE barbers SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return BarberModel.findById(id)
  }
}
