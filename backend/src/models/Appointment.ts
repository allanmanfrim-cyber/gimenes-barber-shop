import fs from 'fs'
import path from 'path'
import { db } from '../database/init.js'
import { Service } from './Service.js'
import { Barber } from './Barber.js'
import { Client } from './Client.js'
import { Payment } from './Payment.js'

export interface Appointment {
  id: number
  client_id: number
  barber_id: number
  service_id: number
  date_time: string
  status: string
  notes: string | null
  reference_images: string | null
  created_at: string
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

const saveBase64Image = (base64String: string, id: number, index: number): string | null => {
  try {
    if (!base64String.startsWith('data:image')) return null

    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) return null

    const type = matches[1]
    const extension = type.split('/')[1] || 'jpg'
    const data = Buffer.from(matches[2], 'base64')
    
    const fileName = `ref_${id}_${index}_${Date.now()}.${extension}`
    const uploadsDir = path.join(process.cwd(), 'uploads')
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    fs.writeFileSync(path.join(uploadsDir, fileName), data)
    
    const appUrl = process.env.APP_URL || 'https://www.gimenesbarber.com.br'
    return `${appUrl}/uploads/${fileName}`
  } catch (error) {
    console.error('Error saving base64 image:', error)
    return null
  }
}

export const AppointmentModel = {
  findAll: (filters?: { date?: string; barberId?: number; status?: string }): Appointment[] => {
    let query = `
      SELECT 
        a.*,
        c.name as client_name, c.whatsapp as client_whatsapp, c.email as client_email,
        c.data_nascimento, c.faltas_sem_aviso, c.status_multa,
        b.name as barber_name, b.whatsapp as barber_whatsapp, b.email as barber_email, b.active as barber_active,
        s.name as service_name, s.duration_minutes, s.price, s.active as service_active,
        p.id as payment_id, p.method as payment_method, p.amount as payment_amount, p.status as payment_status
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN barbers b ON a.barber_id = b.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE 1=1
    `
    const params: (string | number)[] = []

    if (filters?.date) {
      query += ' AND DATE(a.date_time) = ?'
      params.push(filters.date)
    }
    if (filters?.barberId) {
      query += ' AND a.barber_id = ?'
      params.push(filters.barberId)
    }
    if (filters?.status) {
      query += ' AND a.status = ?'
      params.push(filters.status)
    }

    query += ' ORDER BY a.date_time ASC'

    const rows = db.prepare(query).all(...params) as any[]
    return rows.map(formatAppointmentRow)
  },

  findById: (id: number): Appointment | undefined => {
    const row = db.prepare(`
      SELECT 
        a.*,
        c.name as client_name, c.whatsapp as client_whatsapp, c.email as client_email,
        c.data_nascimento, c.faltas_sem_aviso, c.status_multa,
        b.name as barber_name, b.whatsapp as barber_whatsapp, b.email as barber_email, b.active as barber_active,
        s.name as service_name, s.duration_minutes, s.price, s.active as service_active,
        p.id as payment_id, p.method as payment_method, p.amount as payment_amount, p.status as payment_status
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN barbers b ON a.barber_id = b.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.id = ?
    `).get(id) as any

    return row ? formatAppointmentRow(row) : undefined
  },

  findConflicts: (barberId: number, dateTime: string, durationMinutes: number, excludeId?: number): Appointment[] => {
    const endTime = new Date(new Date(dateTime).getTime() + durationMinutes * 60000).toISOString()
    
    let query = `
      SELECT a.*, s.duration_minutes
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.barber_id = ?
        AND a.status NOT IN ('cancelled')
        AND (
          (a.date_time <= ? AND datetime(a.date_time, '+' || s.duration_minutes || ' minutes') > ?)
          OR (a.date_time < ? AND datetime(a.date_time, '+' || s.duration_minutes || ' minutes') >= ?)
          OR (a.date_time >= ? AND a.date_time < ?)
        )
    `
    const params: (string | number)[] = [barberId, dateTime, dateTime, endTime, endTime, dateTime, endTime]

    if (excludeId) {
      query += ' AND a.id != ?'
      params.push(excludeId)
    }

    return db.prepare(query).all(...params) as Appointment[]
  },

  create: (data: {
    clientId: number
    barberId: number
    serviceId: number
    dateTime: string
    notes?: string
    referenceImages?: string[]
  }): Appointment => {
    // 1. Inserir primeiro para obter o ID
    const result = db.prepare(`
      INSERT INTO appointments (client_id, barber_id, service_id, date_time, notes, status)
      VALUES (?, ?, ?, ?, ?, 'confirmed')
    `).run(
      data.clientId, 
      data.barberId, 
      data.serviceId, 
      data.dateTime, 
      data.notes || null
    )
    
    const id = result.lastInsertRowid as number
    
    // 2. Processar imagens se houver
    let savedUrls: string[] = []
    if (data.referenceImages && data.referenceImages.length > 0) {
      savedUrls = data.referenceImages
        .map((img, idx) => saveBase64Image(img, id, idx))
        .filter((url): url is string => url !== null)
      
      if (savedUrls.length > 0) {
        db.prepare('UPDATE appointments SET reference_images = ? WHERE id = ?')
          .run(JSON.stringify(savedUrls), id)
      }
    }
    
    return AppointmentModel.findById(id)!
  },

  update: (id: number, data: Partial<Appointment>): Appointment | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.barber_id !== undefined) { fields.push('barber_id = ?'); values.push(data.barber_id) }
    if (data.service_id !== undefined) { fields.push('service_id = ?'); values.push(data.service_id) }
    if (data.date_time !== undefined) { fields.push('date_time = ?'); values.push(data.date_time) }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status) }
    if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes) }

    if (fields.length === 0) return AppointmentModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return AppointmentModel.findById(id)
  },

  cancel: (id: number): boolean => {
    const result = db.prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?").run(id)
    if (result.changes > 0) {
      db.prepare("UPDATE payments SET status = 'cancelled' WHERE appointment_id = ?").run(id)
    }
    return result.changes > 0
  }
}

function formatAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    client_id: row.client_id,
    barber_id: row.barber_id,
    service_id: row.service_id,
    date_time: row.date_time,
    status: row.status,
    notes: row.notes,
    reference_images: row.reference_images,
    created_at: row.created_at,
    client: row.client_name ? {
      id: row.client_id,
      name: row.client_name,
      whatsapp: row.client_whatsapp,
      email: row.client_email || '',
      data_nascimento: row.data_nascimento,
      faltas_sem_aviso: row.faltas_sem_aviso,
      status_multa: row.status_multa,
      created_at: ''
    } : undefined,
    barber: row.barber_name ? {
      id: row.barber_id,
      name: row.barber_name,
      whatsapp: row.barber_whatsapp || '',
      email: row.barber_email || '',
      active: row.barber_active ?? 1,
      created_at: ''
    } : undefined,
    service: row.service_name ? {
      id: row.service_id,
      name: row.service_name,
      duration_minutes: row.duration_minutes,
      price: row.price,
      active: row.service_active ?? 1,
      created_at: ''
    } : undefined,
    payment: row.payment_id ? {
      id: row.payment_id,
      appointment_id: row.id,
      method: row.payment_method,
      amount: row.payment_amount,
      status: row.payment_status,
      created_at: ''
    } : undefined
  }
}
