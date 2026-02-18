import { db } from '../database/init.js'

export type PaymentMethod = 'pix' | 'nubank' | 'card' | 'machine' | 'cash' | 'local'
export type PaymentStatus = 'pending' | 'paid_pix' | 'paid_card' | 'paid_nubank' | 'pay_on_site' | 'cancelled'

export interface Payment {
  id: number
  appointment_id: number
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  pix_code?: string
  external_reference?: string
  paid_at?: string
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

  findByExternalReference: (externalReference: string): Payment | undefined => {
    return db.prepare('SELECT * FROM payments WHERE external_reference = ?').get(externalReference) as Payment | undefined
  },

  create: (data: {
    appointmentId: number
    method: PaymentMethod
    amount: number
    pixCode?: string
    externalReference?: string
  }): Payment => {
    let status: PaymentStatus = 'pending'
    if (data.method === 'local' || data.method === 'machine' || data.method === 'cash') {
      status = 'pay_on_site'
    }
    
    const result = db.prepare(`
      INSERT INTO payments (appointment_id, method, amount, status, pix_code, external_reference)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.appointmentId, 
      data.method, 
      data.amount, 
      status, 
      data.pixCode || null,
      data.externalReference || null
    )
    
    return PaymentModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Payment>): Payment | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status) }
    if (data.pix_code !== undefined) { fields.push('pix_code = ?'); values.push(data.pix_code) }
    if (data.external_reference !== undefined) { fields.push('external_reference = ?'); values.push(data.external_reference) }
    if (data.paid_at !== undefined) { fields.push('paid_at = ?'); values.push(data.paid_at) }

    if (fields.length === 0) return PaymentModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE payments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return PaymentModel.findById(id)
  },

  confirmPayment: (id: number, method: PaymentMethod): Payment | undefined => {
    const status: PaymentStatus = method === 'pix' ? 'paid_pix' : 'paid_card'
    const paidAt = new Date().toISOString()
    
    db.prepare('UPDATE payments SET status = ?, paid_at = ? WHERE id = ?').run(status, paidAt, id)
    return PaymentModel.findById(id)
  },

  cancel: (id: number): Payment | undefined => {
    db.prepare("UPDATE payments SET status = 'cancelled' WHERE id = ?").run(id)
    return PaymentModel.findById(id)
  }
}
