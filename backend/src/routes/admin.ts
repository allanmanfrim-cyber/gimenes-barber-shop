import { TenantConfigModel } from '../models/TenantConfig.js'
import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { AppointmentModel } from '../models/Appointment.js'
import { ServiceModel } from '../models/Service.js'
import { BarberModel } from '../models/Barber.js'
import { PaymentModel } from '../models/Payment.js'
import { BusinessHoursModel } from '../models/BusinessHours.js'
import { NotificationModel } from '../models/Notification.js'
import { notifyAppointmentCancelled, notifyAppointmentChanged, notifyAppointmentConfirmed } from '../services/notificationService.js'
import { PaymentSettingsModel } from '../models/PaymentSettings.js'
import { ClientModel } from '../models/Client.js'

const router = Router()

router.use(authMiddleware)

router.get('/appointments', (req, res) => {
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

router.put('/appointments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const oldAppointment = AppointmentModel.findById(id)
    
    if (!oldAppointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    const oldDateTime = oldAppointment.date_time
    const appointment = AppointmentModel.update(id, req.body)
    
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    if (req.body.date_time && req.body.date_time !== oldDateTime) {
      await notifyAppointmentChanged(appointment, oldDateTime)
    }

    res.json({ appointment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento' })
  }
})

router.delete('/appointments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const appointment = AppointmentModel.findById(id)
    
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    const success = AppointmentModel.cancel(id)
    if (!success) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    await notifyAppointmentCancelled(appointment)

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

router.post('/barbers', (req, res) => {
  try {
    const { name, whatsapp, email } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Nome e obrigatorio' })
    }
    const barber = BarberModel.create(name, whatsapp, email)
    res.status(201).json({ barber })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar barbeiro' })
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

router.get('/payments', (_req, res) => {
  try {
    const payments = PaymentModel.findAll()
    res.json({ payments })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamentos' })
  }
})

router.put('/payments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const oldPayment = PaymentModel.findById(id)
    
    if (!oldPayment) {
      return res.status(404).json({ message: 'Pagamento nao encontrado' })
    }

    const payment = PaymentModel.update(id, req.body)
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento nao encontrado' })
    }

    if (req.body.status && req.body.status.startsWith('paid') && !oldPayment.status.startsWith('paid')) {
      const appointment = AppointmentModel.findById(payment.appointment_id)
      if (appointment) {
        await notifyAppointmentConfirmed(appointment)
      }
    }

    res.json({ payment })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pagamento' })
  }
})

router.get('/notifications', (_req, res) => {
  try {
    const notifications = NotificationModel.findAll()
    const stats = NotificationModel.getStats()
    res.json({ notifications, stats })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notificacoes' })
  }
})

router.get('/notifications/stats', (_req, res) => {
  try {
    const stats = NotificationModel.getStats()
    res.json({ stats })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatisticas' })
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

router.get('/inactive-clients', (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    const clients = ClientModel.findInactive(days)
    res.json({ clients })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes inativos' })
  }
})

router.get('/birthday-clients', (req, res) => {
  try {
    const { date } = req.query
    const clients = ClientModel.findBirthdays(date as string)
    res.json({ clients })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar clientes aniversariantes' })
  }
})

router.post('/clients/:id/no-show', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    ClientModel.addNoShow(id)
    res.json({ message: 'Falta registrada com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar falta' })
  }
})

router.post('/clients/:id/clear-penalty', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    ClientModel.clearPenalty(id)
    res.json({ message: 'Multa limpa com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao limpar multa' })
  }
})


router.get("/layout", (_req, res) => {
  try {
    const config = TenantConfigModel.findByTenantId("default")
    res.json({ config })
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar configuracoes de layout" })
  }
})

router.put("/layout", (req, res) => {
  try {
    const config = TenantConfigModel.update("default", req.body)
    res.json({ config })
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar configuracoes de layout" })
  }
})

export default router
