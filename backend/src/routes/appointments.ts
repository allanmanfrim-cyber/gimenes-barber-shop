import { Router } from 'express'
import { AppointmentModel } from '../models/Appointment.js'
import { ServiceModel } from '../models/Service.js'
import { ClientModel } from '../models/Client.js'
import { findAvailableBarber } from '../utils/timeSlots.js'

const router = Router()

router.post('/', (req, res) => {
  try {
    const {
      barberId,
      serviceId,
      dateTime,
      clientName,
      clientWhatsapp,
      clientEmail,
      clientBirthDate,
      notes,
      referenceImages
    } = req.body

    if (!serviceId || !dateTime || !clientName || !clientWhatsapp) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const service = ServiceModel.findById(serviceId)

    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    const date = dateTime.split('T')[0]
    const time = dateTime.split('T')[1].substring(0,5)

    let finalBarberId: number | null = null

    if (barberId === 'any') {
      finalBarberId = findAvailableBarber(
        date,
        time,
        service.duration_minutes
      )
    } else {
      finalBarberId = Number(barberId)
    }

    if (!finalBarberId) {
      return res.status(400).json({ message: 'Nenhum barbeiro disponível' })
    }

    const conflicts = AppointmentModel.findConflicts(
      finalBarberId,
      dateTime,
      service.duration_minutes
    )

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Horario indisponivel' })
    }

    const client = ClientModel.create({
      name: clientName,
      whatsapp: clientWhatsapp,
      email: clientEmail,
      birthDate: clientBirthDate
    })

    const appointment = AppointmentModel.create({
      clientId: client.id,
      barberId: finalBarberId,
      serviceId,
      dateTime,
      notes,
      referenceImages
    })

    res.status(201).json({ appointment })

  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar agendamento' })
  }
})

export default router