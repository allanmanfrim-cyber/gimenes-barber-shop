import { Router } from 'express'
import { AppointmentModel } from '../models/Appointment.js'
import { ServiceModel } from '../models/Service.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

/**
 * Listar agendamentos
 */
router.get('/', (req, res) => {
  try {
    const { date, barberId } = req.query

    const appointments = AppointmentModel.findAll({
      date: date as string,
      barberId: barberId ? parseInt(barberId as string) : undefined
    })

    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos' })
  }
})

/**
 * Criar agendamento
 */
router.post('/', (req, res) => {
  try {
    const {
      clientId,
      barberId,
      serviceId,
      dateTime,
      notes,
      referenceImages
    } = req.body

    if (!clientId || !barberId || !serviceId || !dateTime) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const service = ServiceModel.findById(serviceId)

    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    const conflicts = AppointmentModel.findConflicts(
      barberId,
      dateTime,
      service.duration_minutes
    )

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Horario indisponivel' })
    }

    const appointment = AppointmentModel.create({
      clientId,
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

/**
 * Buscar por ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const appointment = AppointmentModel.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    res.json({ appointment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamento' })
  }
})

export default router