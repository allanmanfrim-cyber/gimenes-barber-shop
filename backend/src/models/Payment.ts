import { db } from '../database/init.js'

export interface Payment {
  id: number
  tenant_id: number
  appointment_id: number
  metodo_visual: 'pix' | 'nubank' | 'cartao' | 'dinheiro_local' | 'cartao_local' | 'pix_local'
  metodo_gateway_real: 'pix_online' | 'cartao_online' | 'presencial'
  payment_id?: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
  qr_code?: string
  qr_code_base64?: string
  expiration_time?: string
  created_at: string
}

export const PaymentModel = {
  findAll: (tenantId: number = 1): Payment[] => {
    return db.prepare(`
      SELECT p.*, a.date_time, c.name as client_name, s.name as service_name
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE p.tenant_id = ?
      ORDER BY p.created_at DESC
    `).all(tenantId) as Payment[]
  },

  findById: (id: number): Payment | undefined => {
    return db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as Payment | undefined
  },

  findByExternalId: (paymentId: string): Payment | undefined => {
    return db.prepare('SELECT * FROM payments WHERE payment_id = ?').get(paymentId) as Payment | undefined
  },

  create: (data: {
    appointmentId: number
    metodoVisual: string
    amount: number
    tenantId?: number
    paymentId?: string
    qrCode?: string
    qrCodeBase64?: string
    expirationTime?: string
  }): Payment => {
    const tenantId = data.tenantId || 1
    
    // Mapeamento Inteligente: Visual -> Real
    let metodoReal = 'presencial'
    if (['pix', 'nubank'].includes(data.metodoVisual)) {
        metodoReal = 'pix_online'
    } else if (data.metodoVisual === 'cartao') {
        metodoReal = 'cartao_online'
    }

    const result = db.prepare(`
      INSERT INTO payments (
        appointment_id, metodo_visual, metodo_gateway_real, amount, 
        status, tenant_id, payment_id, qr_code, qr_code_base64, expiration_time
      )
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
    `).run(
        data.appointmentId, 
        data.metodoVisual, 
        metodoReal, 
        data.amount, 
        tenantId,
        data.paymentId || null,
        data.qrCode || null,
        data.qrCodeBase64 || null,
        data.expirationTime || null
    )
    
    return PaymentModel.findById(result.lastInsertRowid as number)!
  },

  updateStatus: (id: number, status: string, paymentId?: string): Payment | undefined => {
    if (paymentId) {
        db.prepare('UPDATE payments SET status = ?, payment_id = ? WHERE id = ?').run(status, paymentId, id)
    } else {
        db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, id)
    }
    
    // Auto-confirmar agendamento se aprovado
    if (status === 'approved') {
        const payment = PaymentModel.findById(id)
        if (payment) {
            db.prepare("UPDATE appointments SET status = 'confirmado' WHERE id = ?").run(payment.appointment_id)
        }
    }

    return PaymentModel.findById(id)
  }
}
