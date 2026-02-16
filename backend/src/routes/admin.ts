import { Router } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { AppointmentModel } from '../models/Appointment.js'
import { ServiceModel } from '../models/Service.js'
import { BarberModel } from '../models/Barber.js'
import { UserModel } from '../models/User.js'
import { PaymentModel } from '../models/Payment.js'
import { BusinessHoursModel } from '../models/BusinessHours.js'
import { PaymentSettingsModel } from '../models/PaymentSettings.js'
import bcrypt from 'bcryptjs'
import { db } from '../database/init.js'

const router = Router()

router.use(authMiddleware)

router.get('/appointments', (req: AuthRequest, res) => {
  try {
    const { date } = req.query
    const barberId = req.userRole === 'admin' 
      ? (req.query.barberId ? parseInt(req.query.barberId as string) : undefined)
      : req.barberId

    const appointments = AppointmentModel.findAll({
      date: date as string,
      barberId
    })
    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos' })
  }
})

router.put('/appointments/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const appointment = AppointmentModel.update(id, req.body)
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }
    res.json({ appointment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento' })
  }
})

router.delete('/appointments/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const success = AppointmentModel.cancel(id)
    if (!success) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }
    res.json({ message: 'Agendamento cancelado com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar agendamento' })
  }
})

router.get('/services', (_req, res) => {
  try {
    const services = ServiceModel.findAll(false)
    res.json({ services })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar servicos' })
  }
})

router.post('/services', (req, res) => {
  try {
    const { name, duration_minutes, price } = req.body
    if (!name || !duration_minutes || !price) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }
    const service = ServiceModel.create({ name, duration_minutes, price })
    res.status(201).json({ service })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar servico' })
  }
})

router.put('/services/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const service = ServiceModel.update(id, req.body)
    if (!service) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }
    res.json({ service })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar servico' })
  }
})

router.delete('/services/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const success = ServiceModel.delete(id)
    if (!success) {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }
    res.json({ message: 'Servico removido com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover servico' })
  }
})

router.get('/barbers', (_req, res) => {
  try {
    const barbers = BarberModel.findAll(false)
    res.json({ barbers })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar barbeiros' })
  }
})

router.post('/barbers', (req: AuthRequest, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' })
  }

  const transaction = db.transaction(() => {
    const { name, username, password } = req.body
    
    if (!name || !username || !password) {
      throw new Error('Dados incompletos')
    }

    const barber = BarberModel.create(name)
    const passwordHash = bcrypt.hashSync(password, 10)
    UserModel.create(username, passwordHash, 'barber', barber.id)
    
    return barber
  })

  try {
    const barber = transaction()
    res.status(201).json({ barber })
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erro ao criar barbeiro' })
  }
})

router.put('/barbers/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const barber = BarberModel.update(id, req.body)
    if (!barber) {
      return res.status(404).json({ message: 'Barbeiro nao encontrado' })
    }
    res.json({ barber })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar barbeiro' })
  }
})

router.delete('/barbers/:id', (req: AuthRequest, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' })
  }

  try {
    const id = parseInt(req.params.id)
    const success = BarberModel.delete(id)
    if (!success) {
      return res.status(404).json({ message: 'Barbeiro nao encontrado' })
    }
    res.json({ message: 'Barbeiro removido com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover barbeiro' })
  }
})

router.get('/payments', (_req, res) => {
  try {
    const payments = PaymentModel.findAll()
    res.json({ payments })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamentos' })
  }
})

router.put('/payments/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const payment = PaymentModel.update(id, req.body)
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento nao encontrado' })
    }
    res.json({ payment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pagamento' })
  }
})

router.get('/business-hours', (_req, res) => {
  try {
    const hours = BusinessHoursModel.findAll()
    res.json({ hours })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar horarios' })
  }
})

router.put('/business-hours', (req, res) => {
  try {
    const { hours } = req.body
    BusinessHoursModel.updateAll(hours)
    const updatedHours = BusinessHoursModel.findAll()
    res.json({ hours: updatedHours })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar horarios' })
  }
})

router.get('/payment-settings', (_req, res) => {
  try {
    const settings = PaymentSettingsModel.getAll()
    res.json({ settings })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configuracoes de pagamento' })
  }
})

router.put('/payment-settings', (req, res) => {
  try {
    const { settings } = req.body
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Dados invalidos' })
    }
    PaymentSettingsModel.setMultiple(settings)
    const updatedSettings = PaymentSettingsModel.getAll()
    res.json({ settings: updatedSettings })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar configuracoes de pagamento' })
  }
})

export default router
