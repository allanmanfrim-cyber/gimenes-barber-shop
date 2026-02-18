import { db } from '../database/init.js'

export type NotificationType = 'whatsapp' | 'email'
export type RecipientType = 'client' | 'barber'
export type NotificationStatus = 'pending' | 'sent' | 'failed'

export interface Notification {
  id: number
  appointment_id: number
  type: NotificationType
  recipient_type: RecipientType
  recipient_contact: string
  status: NotificationStatus
  sent_at?: string
  error_message?: string
  created_at: string
}

export const NotificationModel = {
  findAll: (): Notification[] => {
    return db.prepare('SELECT * FROM notifications ORDER BY created_at DESC').all() as Notification[]
  },

  findByAppointmentId: (appointmentId: number): Notification[] => {
    return db.prepare('SELECT * FROM notifications WHERE appointment_id = ? ORDER BY created_at DESC').all(appointmentId) as Notification[]
  },

  findById: (id: number): Notification | undefined => {
    return db.prepare('SELECT * FROM notifications WHERE id = ?').get(id) as Notification | undefined
  },

  findPending: (): Notification[] => {
    return db.prepare("SELECT * FROM notifications WHERE status = 'pending' ORDER BY created_at ASC").all() as Notification[]
  },

  exists: (appointmentId: number, type: NotificationType, recipientType: RecipientType, recipientContact: string): boolean => {
    const existing = db.prepare(`
      SELECT id FROM notifications 
      WHERE appointment_id = ? AND type = ? AND recipient_type = ? AND recipient_contact = ? AND status = 'sent'
    `).get(appointmentId, type, recipientType, recipientContact)
    return !!existing
  },

  create: (data: {
    appointmentId: number
    type: NotificationType
    recipientType: RecipientType
    recipientContact: string
  }): Notification => {
    const result = db.prepare(`
      INSERT INTO notifications (appointment_id, type, recipient_type, recipient_contact, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(data.appointmentId, data.type, data.recipientType, data.recipientContact)
    
    return NotificationModel.findById(result.lastInsertRowid as number)!
  },

  markSent: (id: number): Notification | undefined => {
    const sentAt = new Date().toISOString()
    db.prepare("UPDATE notifications SET status = 'sent', sent_at = ? WHERE id = ?").run(sentAt, id)
    return NotificationModel.findById(id)
  },

  markFailed: (id: number, errorMessage: string): Notification | undefined => {
    db.prepare("UPDATE notifications SET status = 'failed', error_message = ? WHERE id = ?").run(errorMessage, id)
    return NotificationModel.findById(id)
  },

  getStats: (): { total: number; sent: number; failed: number; pending: number } => {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM notifications
    `).get() as { total: number; sent: number; failed: number; pending: number }
    return stats
  }
}
