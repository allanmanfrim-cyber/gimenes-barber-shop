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
    reference_images: row.reference_images,
  }
}

export const AppointmentModel = {

  findAll(): Appointment[] {
    const rows = db.prepare(`SELECT * FROM appointments`).all()
    return rows.map(formatAppointmentRow)
  },

  findById(id: number): Appointment | undefined {
    const row = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(id)
    return row ? formatAppointmentRow(row) : undefined
  },

  findConflicts(barberId: number, dateTime: string): Appointment[] {
    const rows = db.prepare(`
      SELECT * FROM appointments
      WHERE barber_id = ?
      AND date_time = ?
      AND status != 'cancelado'
    `).all(barberId, dateTime)

    return rows.map(formatAppointmentRow)
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

    db.prepare(`
      UPDATE appointments
      SET status = ?, date_time = ?, notes = ?
      WHERE id = ?
    `).run(
      data.status,
      data.date_time,
      data.notes,
      id
    )

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