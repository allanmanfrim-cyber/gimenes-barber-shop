import { Router } from 'express'
import { BusinessHoursModel } from '../models/BusinessHours.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const hours = BusinessHoursModel.findAll()
    res.json({ hours })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar horarios' })
  }
})

export default router
