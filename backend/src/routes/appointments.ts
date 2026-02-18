import { Router } from 'express'
import { AppointmentModel } from '../models/Appointment.js'
import { ClientModel } from '../models/Client.js'
import { ServiceModel } from '../models/Service.js'
import { PaymentModel, PaymentMethod } from '../models/Payment.js'
import { findAvailableBarber } from '../utils/timeSlots.js'
import { MercadoPagoService } from '../services/mercadoPagoService.js'
import { notifyAppointmentConfirmed } from '../services/notificationService.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { serviceId, barberId, dateTime, clientName, clientWhatsapp, clientEmail, notes, paymentMethod } = req.body

    if (!serviceId || !dateTime || !clientName || !clientWhatsapp || !paymentMethod) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const service = ServiceModel.findById(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    let finalBarberId: number
    const [date, time] = dateTime.split('T')
    const timeOnly = time.substring(0, 5)

    if (barberId === 'any') {
      const availableBarber = findAvailableBarber(date, timeOnly, service.duration_minutes)
      if (!availableBarber) {
        return res.status(400).json({ message: 'Nenhum barbeiro disponivel neste horario' })
      }
      finalBarberId = availableBarber
    } else {
      const conflicts = AppointmentModel.findConflicts(barberId, dateTime, service.duration_minutes)
      if (conflicts.length > 0) {
        return res.status(400).json({ message: 'Horario indisponivel para este barbeiro' })
      }
      finalBarberId = barberId
    }

    const client = ClientModel.findOrCreate(clientName, clientWhatsapp, clientEmail)

    const appointment = AppointmentModel.create({
      clientId: client.id,
      barberId: finalBarberId,
      serviceId,
      dateTime,
      notes
    })

    let pixCode: string | undefined
    let pixQrCodeBase64: string | undefined
    let checkoutUrl: string | undefined
    let externalReference: string | undefined

    const method = paymentMethod as PaymentMethod

    const isPresencial = method === 'local' || method === 'machine' || method === 'cash'

    if (method === 'pix' || method === 'nubank') {
      const pixResult = await MercadoPagoService.createPixPayment(
        service.price, 
        appointment.id, 
        clientEmail
      )
      pixCode = pixResult.qrCode
      pixQrCodeBase64 = pixResult.qrCodeBase64
      externalReference = pixResult.externalReference
    } else if (method === 'card') {
      const cardResult = await MercadoPagoService.createCardCheckout(
        service.price,
        appointment.id,
        service.name,
        clientEmail
      )
      checkoutUrl = cardResult.initPoint
      externalReference = cardResult.externalReference
    }

    PaymentModel.create({
      appointmentId: appointment.id,
      method,
      amount: service.price,
      pixCode,
      externalReference
    })

    const fullAppointment = AppointmentModel.findById(appointment.id)

    if (isPresencial && fullAppointment) {
      await notifyAppointmentConfirmed(fullAppointment)
    }

    res.status(201).json({
      appointment: fullAppointment,
      pixCode,
      pixQrCodeBase64,
      checkoutUrl
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    res.status(500).json({ message: 'Erro ao criar agendamento' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const appointment = AppointmentModel.findById(parseInt(req.params.id))
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }
    res.json({ appointment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamento' })
  }
})

export default router
