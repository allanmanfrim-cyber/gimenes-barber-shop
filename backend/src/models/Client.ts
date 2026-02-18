import { db } from '../database/init.js'

export interface Client {
  id: number
  name: string
  whatsapp: string
  email: string | null
  data_nascimento?: string
  faltas_sem_aviso?: number
  status_multa?: string
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

  create: (name: string, whatsapp: string, email?: string, dataNascimento?: string): Client => {
    const result = db.prepare('INSERT INTO clients (name, whatsapp, email, data_nascimento) VALUES (?, ?, ?, ?)').run(name, whatsapp, email || null, dataNascimento || null)
    return ClientModel.findById(result.lastInsertRowid as number)!
  },

  findOrCreate: (name: string, whatsapp: string, email?: string, dataNascimento?: string): Client => {
    const existing = ClientModel.findByWhatsapp(whatsapp)
    if (existing) {
      const updates: string[] = []
      const params: any[] = []

      if (existing.name !== name) {
        updates.push('name = ?')
        params.push(name)
      }
      if (email && existing.email !== email) {
        updates.push('email = ?')
        params.push(email)
      }
      if (dataNascimento && existing.data_nascimento !== dataNascimento) {
        updates.push('data_nascimento = ?')
        params.push(dataNascimento)
      }

      if (updates.length > 0) {
        params.push(existing.id)
        db.prepare(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`).run(...params)
        return ClientModel.findById(existing.id)!
      }
      return existing
    }
    return ClientModel.create(name, whatsapp, email, dataNascimento)
  },

  update: (id: number, data: Partial<Client>): Client | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name) }
    if (data.whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(data.whatsapp) }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email) }
    if (data.data_nascimento !== undefined) { fields.push('data_nascimento = ?'); values.push(data.data_nascimento) }
    if (data.faltas_sem_aviso !== undefined) { fields.push('faltas_sem_aviso = ?'); values.push(data.faltas_sem_aviso) }
    if (data.status_multa !== undefined) { fields.push('status_multa = ?'); values.push(data.status_multa) }

    if (fields.length === 0) return ClientModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE clients SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return ClientModel.findById(id)
  },

  addNoShow: (id: number): boolean => {
    const result = db.prepare('UPDATE clients SET faltas_sem_aviso = faltas_sem_aviso + 1, status_multa = "ativa" WHERE id = ?').run(id)
    return result.changes > 0
  },

  clearPenalty: (id: number): boolean => {
    const result = db.prepare('UPDATE clients SET status_multa = "paga" WHERE id = ?').run(id)
    return result.changes > 0
  },

  findInactive: (days: number): any[] => {
    return db.prepare(`
      SELECT 
        c.*,
        MAX(a.date_time) as last_appointment
      FROM clients c
      JOIN appointments a ON a.client_id = c.id
      GROUP BY c.id
      HAVING last_appointment < DATE('now', '-' || ? || ' days')
      ORDER BY last_appointment DESC
    `).all(days)
  },

  findBirthdays: (date?: string): Client[] => {
    const searchDate = date || new Date().toISOString().split('T')[0]
    const [year, month, day] = searchDate.split('-')
    return db.prepare(`
      SELECT * FROM clients 
      WHERE strftime('%m-%d', data_nascimento) = ?
    `).all(`${month}-${day}`) as Client[]
  }
}
