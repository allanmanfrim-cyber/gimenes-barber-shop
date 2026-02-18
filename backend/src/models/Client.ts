import { db } from '../database/init.js'

export interface Client {
  id: number
  name: string
  whatsapp: string
  email: string | null
  created_at: string
}

export const ClientModel = {
  findAll: (): Client[] => {
    return db.prepare('SELECT * FROM clients ORDER BY name').all() as Client[]
  },

  findById: (id: number): Client | undefined => {
    return db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as Client | undefined
  },

  findByWhatsapp: (whatsapp: string): Client | undefined => {
    return db.prepare('SELECT * FROM clients WHERE whatsapp = ?').get(whatsapp) as Client | undefined
  },

  create: (name: string, whatsapp: string, email?: string): Client => {
    const result = db.prepare('INSERT INTO clients (name, whatsapp, email) VALUES (?, ?, ?)').run(name, whatsapp, email || null)
    return ClientModel.findById(result.lastInsertRowid as number)!
  },

  findOrCreate: (name: string, whatsapp: string, email?: string): Client => {
    const existing = ClientModel.findByWhatsapp(whatsapp)
    if (existing) {
      if (existing.name !== name || (email && existing.email !== email)) {
        db.prepare('UPDATE clients SET name = ?, email = COALESCE(?, email) WHERE id = ?').run(name, email || null, existing.id)
        return ClientModel.findById(existing.id)!
      }
      return existing
    }
    return ClientModel.create(name, whatsapp, email)
  },

  update: (id: number, data: Partial<Client>): Client | undefined => {
    const fields: string[] = []
    const values: (string | null)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(data.whatsapp) }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email) }

    if (fields.length === 0) return ClientModel.findById(id)

    values.push(id.toString())
    db.prepare(`UPDATE clients SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return ClientModel.findById(id)
  }
}
