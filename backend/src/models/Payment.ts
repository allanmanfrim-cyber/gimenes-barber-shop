import { db } from '../database/init.js'

export interface Payment {
  id: number
  tenant_id: number
  appointment_id: number
  appointmentId: number
  method: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
  qr_code?: string
  qr_code_base64?: string
  expiration_time?: string
  created_at: string
  paid_at?: string
  external_reference?: string
  payment_id?: string
}

export type PaymentMethod = 'pix' | 'credit_card' | 'nubank' | 'cash' | 'machine' | 'local' | 'card'

export const PaymentModel = {
  findAll: (tenantId?: number): Payment[] => {
    if (tenantId) {
      return db.prepare('SELECT * FROM payments WHERE tenant_id = ?').all(tenantId) as any[]
    }
    return db.prepare('SELECT * FROM payments').all() as any[]
  },

  findById: (id: number): Payment | undefined => {
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as any
    if (payment) {
      payment.appointmentId = payment.appointment_id
      payment.payment_id = payment.external_reference
    }
    return payment as Payment | undefined
  },

  findByAppointmentId: (appointmentId: number): Payment | undefined => {
    const payment = db.prepare('SELECT * FROM payments WHERE appointment_id = ?').get(appointmentId) as any
    if (payment) {
      payment.appointmentId = payment.appointment_id
      payment.payment_id = payment.external_reference
    }
    return payment as Payment | undefined
  },

  findByExternalReference: (reference: string): Payment | undefined => {
    const payment = db.prepare('SELECT * FROM payments WHERE external_reference = ?').get(reference) as any
    if (payment) {
      payment.appointmentId = payment.appointment_id
      payment.payment_id = payment.external_reference
    }
    return payment as Payment | undefined
  },

  findByExternalId: (paymentId: string): Payment | undefined => {
    return PaymentModel.findByExternalReference(paymentId)
  },

  update: (id: number, data: any): Payment | undefined => {
    const existing = PaymentModel.findById(id)
    if (!existing) return undefined

    const updates = []
    const params = []

    if (data.status) {
      updates.push('status = ?')
      params.push(data.status)
    }
    if (data.paid_at) {
      updates.push('paid_at = ?')
      params.push(data.paid_at)
    }
    if (data.external_reference || data.externalReference) {
      updates.push('external_reference = ?')
      params.push(data.external_reference || data.externalReference)
    }
    if (data.method) {
      updates.push('method = ?')
      params.push(data.method)
    }

    if (updates.length > 0) {
      params.push(id)
      db.prepare(`UPDATE payments SET ${updates.join(', ')} WHERE id = ?`).run(...params)
    }

    return PaymentModel.findById(id)
  },

  updateStatus: (id: number, status: string, paymentId?: string): Payment | undefined => {
    return PaymentModel.update(id, { status, external_reference: paymentId })
  },

  confirmPayment: (id: number, paidAt: string = new Date().toISOString()): Payment | undefined => {
    return PaymentModel.update(id, { status: 'approved', paid_at: paidAt })
  },

  create: (data: {
    appointmentId: number
    method: string
    amount: number
    pixCode?: string
    externalReference?: string
    tenantId?: number
  }): Payment => {
    const tenantId = data.tenantId || 1
    const result = db.prepare(`
      INSERT INTO payments (appointment_id, method, amount, status, external_reference, tenant_id)
      VALUES (?, ?, ?, 'pending', ?, ?)
    `).run(
      data.appointmentId,
      data.method,
      data.amount,
      data.externalReference || null,
      tenantId
    )
    
    return PaymentModel.findById(result.lastInsertRowid as number)!
  }
}

