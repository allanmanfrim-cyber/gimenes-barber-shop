import { Router } from 'express'
import { generateTimeSlots } from '../utils/timeSlots.js'
import { ServiceModel } from '../models/Service.js'

const router = Router()

router.get('/:barberId/:date', (req, res) => {
  try {
    const { barberId, date } = req.params
    const serviceId = parseInt(req.query.serviceId as string)

    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId e obrigatorio' })
    }

    const service = ServiceModel.findById(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    const barberIdParam = barberId === 'any' ? 'any' : parseInt(barberId)
    const slots = generateTimeSlots(date, barberIdParam, service.duration_minutes)

    res.json({ slots })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disponibilidade' })
  }
})

export default router
