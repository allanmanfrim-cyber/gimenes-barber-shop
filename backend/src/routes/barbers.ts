import { Router } from 'express'
import { BarberModel } from '../models/Barber.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const barbers = BarberModel.findAll(true)
    res.json({ barbers })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar barbeiros' })
  }
})

export default router
