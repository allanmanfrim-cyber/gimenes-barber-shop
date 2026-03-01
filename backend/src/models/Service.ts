import { db } from '../database/init.js'

export const AppointmentModel = {

  create(data: any) {
    const stmt = db.prepare(`
      INSERT INTO appointments
      (tenant_id, client_id, barber_id, service_id, date_time, status, notes, reference_images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.tenantId,
      data.clientId,
      data.barberId,
      data.serviceId,
      data.dateTime,
      data.status,
      data.notes,
      data.referenceImages
    )

    return { id: result.lastInsertRowid, ...data }
  },

  findConflicts(barberId: number, dateTime: string) {
    return db.prepare(`
      SELECT * FROM appointments
      WHERE barber_id = ?
      AND date_time = ?
    `).all(barberId, dateTime)
  }

}