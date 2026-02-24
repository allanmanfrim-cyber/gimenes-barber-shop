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
  findById: (id: number): Appointment | undefined => {
    const row = db.prepare(`
      SELECT a.*
      FROM appointments a
      WHERE a.id = ?
    `).get(id) as Appointment | undefined

    return row
  }
}