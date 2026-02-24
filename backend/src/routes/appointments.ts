import { Router } from 'express'
import { AppointmentModel } from '../models/Appointment.js'
import { ServiceModel } from '../models/Service.js'
import { ClientModel } from '../models/Client.js'
import { authMiddleware } from '../middleware/auth.js'

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

    if (!barberId || !serviceId || !dateTime || !clientName || !clientWhatsapp) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const service = ServiceModel.findById(serviceId)

    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    // 🔥 Criar cliente automaticamente
    const client = ClientModel.create({
      name: clientName,
      whatsapp: clientWhatsapp,
      email: clientEmail,
      birthDate: clientBirthDate
    })

    const conflicts = AppointmentModel.findConflicts(
      barberId,
      dateTime,
      service.duration_minutes
    )

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Horario indisponivel' })
    }

    const appointment = AppointmentModel.create({
      clientId: client.id,
      barberId,
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