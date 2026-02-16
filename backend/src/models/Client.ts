import { db } from '../database/init.js'

export interface Client {
  id: number
  name: string
  whatsapp: string
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

  create: (name: string, whatsapp: string): Client => {
    const result = db.prepare('INSERT INTO clients (name, whatsapp) VALUES (?, ?)').run(name, whatsapp)
    return ClientModel.findById(result.lastInsertRowid as number)!
  },

  findOrCreate: (name: string, whatsapp: string): Client => {
    const existing = ClientModel.findByWhatsapp(whatsapp)
    if (existing) {
      if (existing.name !== name) {
        db.prepare('UPDATE clients SET name = ? WHERE id = ?').run(name, existing.id)
        return ClientModel.findById(existing.id)!
      }
      return existing
    }
    return ClientModel.create(name, whatsapp)
  }
}
