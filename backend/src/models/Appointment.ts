import { db } from '../database/init.js'
import { Barber } from './Barber.js'
import { Service } from './Service.js'
import { Client } from './Client.js'
import { Payment } from './Payment.js'

export interface Appointment {
  id: number
  tenant_id: number
  client_id: number
  barber_id: number
  service_id: number
  date_time: string
  status: 'pendente_pagamento' | 'confirmado' | 'cancelado' | 'no_show' | 'concluido'
  notes?: string
  reference_images?: string[] | string | null
  client?: Client
  barber?: Barber
  service?: Service
  payment?: Payment
}

export const AppointmentModel = {
  findAll: (options?: string | { date?: string, barberId?: number }, barberIdParam?: number): Appointment[] => {
    let date: string | undefined
    let barberId: number | undefined

    if (typeof options === 'object') {
      date = options.date
      barberId = options.barberId
    } else {
      date = options
      barberId = barberIdParam
    }

    let query = `
      SELECT 
        a.*,
        c.name as client_name, c.whatsapp as client_whatsapp, c.email as client_email, c.data_nascimento, c.faltas_sem_aviso, c.status_multa, c.tenant_id as client_tenant_id,
        b.name as barber_name, b.whatsapp as barber_whatsapp, b.email as barber_email, b.active as barber_active, b.tenant_id as barber_tenant_id, b.display_order as barber_display_order,
        s.name as service_name, s.duration_minutes, s.price, s.active as service_active, s.tenant_id as service_tenant_id,
        p.id as payment_id, p.method as payment_method, p.amount as payment_amount, p.status as payment_status
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN barbers b ON a.barber_id = b.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE 1=1
    `
    const params: (string | number)[] = []

    if (date) {
      query += ' AND date(a.date_time) = ?'
      params.push(date)
    }

    if (barberId) {
      query += ' AND a.barber_id = ?'
      params.push(barberId)
    }

    query += ' ORDER BY a.date_time ASC'

    const rows = db.prepare(query).all(...params) as any[]
    return rows.map(formatAppointmentRow)
  },

  findById: (id: number): Appointment | undefined => {
    const row = db.prepare(`
      SELECT 
        a.*,
        c.name as client_name, c.whatsapp as client_whatsapp, c.email as client_email, c.data_nascimento, c.faltas_sem_aviso, c.status_multa, c.tenant_id as client_tenant_id,
        b.name as barber_name, b.whatsapp as barber_whatsapp, b.email as barber_email, b.active as barber_active, b.tenant_id as barber_tenant_id, b.display_order as barber_display_order,
        s.name as service_name, s.duration_minutes, s.price, s.active as service_active, s.tenant_id as service_tenant_id,
        p.id as payment_id, p.method as payment_method, p.amount as payment_amount, p.status as payment_status
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN barbers b ON a.barber_id = b.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.id = ?
    `).get(id) as any

    if (!row) return undefined
    return formatAppointmentRow(row)
  },

  findConflicts: (barberId: number, dateTime: string, durationMinutes: number, excludeId?: number, tenantId: number = 1): Appointment[] => {
    const start = new Date(dateTime)
    const end = new Date(start.getTime() + durationMinutes * 60000)
    
    // Simplificando busca por conflitos: mesma data e mesmo barbeiro
    // Na pratica, precisaria calcular sobreposicao de horarios
    const query = `
      SELECT * FROM appointments 
      WHERE barber_id = ? AND tenant_id = ?
      AND status NOT IN ('cancelado', 'no_show')
      AND (
        (date_time >= ? AND date_time < ?) OR
        (datetime(date_time, '+' || (SELECT duration_minutes FROM services WHERE id = service_id) || ' minutes') > ? AND date_time <= ?)
      )
      ${excludeId ? 'AND id != ?' : ''}
    `
    const params = [barberId, tenantId, dateTime, end.toISOString(), dateTime, dateTime]
    if (excludeId) params.push(excludeId)

    return db.prepare(query).all(...params) as any[]
  },

  create: (data: {
    clientId: number
    barberId: number
    serviceId: number
    dateTime: string
    status?: Appointment['status']
    notes?: string
    referenceImages?: string[] | string | null
    tenantId?: number
  }): Appointment => {
    const tenantId = data.tenantId || 1
    const status = data.status || 'pendente_pagamento'
    let imagesStr = data.referenceImages
    if (Array.isArray(data.referenceImages)) {
      imagesStr = JSON.stringify(data.referenceImages)
    }

    const result = db.prepare(`
      INSERT INTO appointments (client_id, barber_id, service_id, date_time, status, notes, reference_images, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.clientId,
      data.barberId,
      data.serviceId,
      data.dateTime,
      status,
      data.notes || null,
      imagesStr || null,
      tenantId
    )
    
    return AppointmentModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Appointment>): Appointment | undefined => {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status) }
    if (data.date_time !== undefined) { fields.push('date_time = ?'); values.push(data.date_time) }
    if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes) }

    if (fields.length === 0) return AppointmentModel.findById(id)

    values.push(id)
    db.prepare(`UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    return AppointmentModel.findById(id)
  },

  cancel: (id: number): boolean => {
    const result = db.prepare("UPDATE appointments SET status = 'cancelado' WHERE id = ?").run(id)
    return result.changes > 0
  },

  delete: (id: number): boolean => {
    const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(id)
    return result.changes > 0
  }
}

function formatAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    client_id: row.client_id,
    barber_id: row.barber_id,
    service_id: row.service_id,
    date_time: row.date_time,
    status: row.status,
    notes: row.notes,
    reference_images: (() => { try { return row.reference_images ? JSON.parse(row.reference_images) : [] } catch { return [] } })(),
    client: row.client_name ? {
      id: row.client_id,
      tenant_id: row.client_tenant_id || row.tenant_id,
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
      tenant_id: row.barber_tenant_id || row.tenant_id,
      name: row.barber_name,
      whatsapp: row.barber_whatsapp || '',
      email: row.barber_email || '',
      active: row.barber_active ?? 1,
      display_order: row.barber_display_order || 0,
      created_at: ''
    } : undefined,
    service: row.service_name ? {
      id: row.service_id,
      tenant_id: row.service_tenant_id || row.tenant_id,
      name: row.service_name,
      duration_minutes: row.duration_minutes,
      price: row.price,
      active: row.service_active ?? 1,
      created_at: ''
    } : undefined,
    payment: row.payment_id ? {
      id: row.payment_id,
      tenant_id: row.tenant_id,
      appointment_id: row.id,
      appointmentId: row.id,
      method: row.payment_method,
      amount: row.payment_amount,
      status: row.payment_status,
      created_at: '',
      metodo_visual: row.payment_method,
      metodo_gateway_real: 'presencial'
    } as any : undefined
  }
}


