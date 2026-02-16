import { db } from '../database/init.js'

export interface Payment {
  id: number
  appointment_id: number
  method: string
  amount: number
  status: string
  pix_code?: string
  created_at: string
}

export const PaymentModel = {
  findAll: (): Payment[] => {
    return db.prepare(`
      SELECT p.*, a.date_time, c.name as client_name, s.name as service_name
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      ORDER BY p.created_at DESC
    `).all() as Payment[]
  },

  findById: (id: number): Payment | undefined => {
    return db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as Payment | undefined
  },

  findByAppointmentId: (appointmentId: number): Payment | undefined => {
    return db.prepare('SELECT * FROM payments WHERE appointment_id = ?').get(appointmentId) as Payment | undefined
  },

  create: (data: {
    appointmentId: number
    method: string
    amount: number
    pixCode?: string
  }): Payment => {
    const status = data.method === 'local' ? 'pending' : 'pending'
    const result = db.prepare(`
      INSERT INTO payments (appointment_id, method, amount, status, pix_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.appointmentId, data.method, data.amount, status, data.pixCode || null)
    
    return PaymentModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Payment>): Payment | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status) }

    if (fields.length === 0) return PaymentModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE payments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return PaymentModel.findById(id)
  }
}
