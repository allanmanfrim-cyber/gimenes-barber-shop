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

  findAll: (options?: { date?: string; barberId?: number }): Appointment[] => {

    let query = `
      SELECT 
        a.*,
        p.id as payment_id,
        p.method as payment_method,
        p.amount as payment_amount,
        p.status as payment_status
      FROM appointments a
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE 1=1
    `

    const params: any[] = []

    if (options?.date) {
      query += ' AND date(a.date_time) = ?'
      params.push(options.date)
    }

    if (options?.barberId) {
      query += ' AND a.barber_id = ?'
      params.push(options.barberId)
    }

    query += ' ORDER BY a.date_time ASC'

    return db.prepare(query).all(...params) as Appointment[]
  },

  findById: (id: number): Appointment | undefined => {

    return db.prepare(`
      SELECT 
        a.*,
        p.id as payment_id,
        p.method as payment_method,
        p.amount as payment_amount,
        p.status as payment_status
      FROM appointments a
      LEFT JOIN payments p ON a.id = p.appointment_id
      WHERE a.id = ?
    `).get(id) as Appointment | undefined
  },

  findConflicts: (
    barberId: number,
    dateTime: string,
    durationMinutes: number,
    excludeId?: number,
    tenantId: number = 1
  ): Appointment[] => {

    const start = new Date(dateTime)
    const end = new Date(start.getTime() + durationMinutes * 60000)

    let query = `
      SELECT *
      FROM appointments
      WHERE barber_id = ?
        AND tenant_id = ?
        AND status NOT IN ('cancelado', 'no_show')
        AND (
          (date_time >= ? AND date_time < ?)
          OR
          (datetime(date_time, '+' || ? || ' minutes') > ? AND date_time <= ?)
        )
    `

    const params: any[] = [
      barberId,
      tenantId,
      dateTime,
      end.toISOString(),
      durationMinutes,
      dateTime,
      dateTime
    ]

    if (excludeId) {
      query += ' AND id != ?'
      params.push(excludeId)
    }

    return db.prepare(query).all(...params) as Appointment[]
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

    const result = db.prepare(`
      INSERT INTO appointments 
      (client_id, barber_id, service_id, date_time, status, notes, reference_images, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.clientId,
      data.barberId,
      data.serviceId,
      data.dateTime,
      data.status || 'pendente_pagamento',
      data.notes || null,
      data.referenceImages || null,
      data.tenantId || 1
    )

    return AppointmentModel.findById(result.lastInsertRowid as number)!
  },

  update: (id: number, data: Partial<Appointment>): Appointment | undefined => {

    const fields: string[] = []
    const values: any[] = []

    if (data.status !== undefined) {
      fields.push('status = ?')
      values.push(data.status)
    }

    if (data.date_time !== undefined) {
      fields.push('date_time = ?')
      values.push(data.date_time)
    }

    if (data.notes !== undefined) {
      fields.push('notes = ?')
      values.push(data.notes)
    }

    if (fields.length === 0) return AppointmentModel.findById(id)

    values.push(id)

    db.prepare(`
      UPDATE appointments
      SET ${fields.join(', ')}
      WHERE id = ?
    `).run(...values)

    return AppointmentModel.findById(id)
  },

  cancel: (id: number): boolean => {

    const result = db.prepare(`
      UPDATE appointments 
      SET status = 'cancelado'
      WHERE id = ?
    `).run(id)

    return result.changes > 0
  },

  delete: (id: number): boolean => {

    const result = db.prepare(`
      DELETE FROM appointments 
      WHERE id = ?
    `).run(id)

    return result.changes > 0
  }
}