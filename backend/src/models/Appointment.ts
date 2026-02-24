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

function mapRow(row: any): Appointment {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    client_id: row.client_id,
    barber_id: row.barber_id,
    service_id: row.service_id,
    date_time: row.date_time,
    status: row.status,
    notes: row.notes,
    reference_images: row.reference_images
  }
}

export const AppointmentModel = {

  findAll(options?: { date?: string; barberId?: number }): Appointment[] {

    let query = `
      SELECT *
      FROM appointments
      WHERE 1=1
    `

    const params: any[] = []

    if (options?.date) {
      query += ` AND date(date_time) = ?`
      params.push(options.date)
    }

    if (options?.barberId) {
      query += ` AND barber_id = ?`
      params.push(options.barberId)
    }

    query += ` ORDER BY date_time ASC`

    const rows = db.prepare(query).all(...params)
    return rows.map(mapRow)
  },

  findById(id: number): Appointment | undefined {
    const row = db.prepare(`
      SELECT *
      FROM appointments
      WHERE id = ?
    `).get(id)

    return row ? mapRow(row) : undefined
  },

  findConflicts(
    barberId: number,
    dateTime: string,
    durationMinutes: number,
    excludeId?: number,
    tenantId: number = 1
  ): Appointment[] {

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
      query += ` AND id != ?`
      params.push(excludeId)
    }

    const rows = db.prepare(query).all(...params)
    return rows.map(mapRow)
  },

  create(data: {
    clientId: number
    barberId: number
    serviceId: number
    dateTime: string
    status?: Appointment['status']
    notes?: string
    referenceImages?: string[] | string | null
    tenantId?: number
  }): Appointment {

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

    return this.findById(result.lastInsertRowid as number)!
  },

  update(id: number, data: Partial<Appointment>): Appointment | undefined {

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

    if (fields.length === 0) {
      return this.findById(id)
    }

    values.push(id)

    db.prepare(`
      UPDATE appointments
      SET ${fields.join(', ')}
      WHERE id = ?
    `).run(...values)

    return this.findById(id)
  },

  cancel(id: number): boolean {
    const result = db.prepare(`
      UPDATE appointments
      SET status = 'cancelado'
      WHERE id = ?
    `).run(id)

    return result.changes > 0
  },

  delete(id: number): boolean {
    const result = db.prepare(`
      DELETE FROM appointments
      WHERE id = ?
    `).run(id)

    return result.changes > 0
  }
}