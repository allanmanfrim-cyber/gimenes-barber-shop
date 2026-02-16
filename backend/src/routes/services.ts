import { Router } from 'express'
import { ServiceModel } from '../models/Service.js'

const router = Router()

router.get('/', (_req, res) => {
  try {
    const services = ServiceModel.findAll(true)
    res.json({ services })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar servicos' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const service = ServiceModel.findById(parseInt(req.params.id))
    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }
    res.json({ service })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar servico' })
  }
})

export default router
