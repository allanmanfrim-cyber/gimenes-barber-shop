import { Router } from 'express'
import { PaymentModel } from '../models/Payment.js'
import { AppointmentModel } from '../models/Appointment.js'
import { MercadoPagoService } from '../services/mercadoPagoService.js'
import { notifyAppointmentConfirmed } from '../services/notificationService.js'

const router = Router()

router.post('/pix', async (req, res) => {
  try {
    const { appointmentId, amount, clientEmail } = req.body

    if (!appointmentId || !amount) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const appointment = AppointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    const pixResult = await MercadoPagoService.createPixPayment(amount, appointmentId, clientEmail)

    const existingPayment = PaymentModel.findByAppointmentId(appointmentId)
    if (existingPayment) {
      PaymentModel.update(existingPayment.id, {
        pix_code: pixResult.qrCode,
        external_reference: pixResult.externalReference
      })
    }

    res.json({
      success: true,
      pixCode: pixResult.qrCode,
      qrCodeBase64: pixResult.qrCodeBase64,
      externalReference: pixResult.externalReference
    })
  } catch (error) {
    console.error('Error creating pix payment:', error)
    res.status(500).json({ message: 'Erro ao gerar pagamento Pix' })
  }
})

router.post('/card', async (req, res) => {
  try {
    const { appointmentId, amount, serviceName, clientEmail } = req.body

    if (!appointmentId || !amount || !serviceName) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    const appointment = AppointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    const checkoutResult = await MercadoPagoService.createCardCheckout(
      amount, 
      appointmentId, 
      serviceName, 
      clientEmail
    )

    const existingPayment = PaymentModel.findByAppointmentId(appointmentId)
    if (existingPayment) {
      PaymentModel.update(existingPayment.id, {
        external_reference: checkoutResult.externalReference
      })
    }

    res.json({
      success: true,
      preferenceId: checkoutResult.preferenceId,
      initPoint: checkoutResult.initPoint,
      externalReference: checkoutResult.externalReference
    })
  } catch (error) {
    console.error('Error creating card checkout:', error)
    res.status(500).json({ message: 'Erro ao criar checkout de cartao' })
  }
})

router.post('/webhook', async (req, res) => {
  try {
    const webhookData = req.body

    console.log('Webhook received:', JSON.stringify(webhookData))

    if (webhookData.type === 'payment') {
      const result = await MercadoPagoService.processWebhook(webhookData)

      if (result.success && result.status === 'approved' && result.externalReference) {
        const payment = PaymentModel.findByExternalReference(result.externalReference)
        
        if (payment) {
          PaymentModel.confirmPayment(payment.id, payment.method === 'pix' ? 'pix' : 'card')
          
          const appointment = AppointmentModel.findById(payment.appointment_id)
          if (appointment) {
            await notifyAppointmentConfirmed(appointment)
          }
        }
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(200).json({ received: true })
  }
})

router.get('/:id/status', async (req, res) => {
  try {
    const payment = PaymentModel.findById(parseInt(req.params.id))
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento nao encontrado' })
    }

    res.json({
      id: payment.id,
      status: payment.status,
      method: payment.method,
      paidAt: payment.paid_at
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao consultar status' })
  }
})

router.post('/confirm-simulation', async (req, res) => {
  try {
    const { externalReference, method } = req.body

    if (!externalReference) {
      return res.status(400).json({ message: 'Referencia nao informada' })
    }

    const payment = PaymentModel.findByExternalReference(externalReference)
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento nao encontrado' })
    }

    PaymentModel.confirmPayment(payment.id, method || payment.method)

    const appointment = AppointmentModel.findById(payment.appointment_id)
    if (appointment) {
      await notifyAppointmentConfirmed(appointment)
    }

    res.json({ success: true, payment: PaymentModel.findById(payment.id) })
  } catch (error) {
    console.error('Error confirming simulation:', error)
    res.status(500).json({ message: 'Erro ao confirmar pagamento' })
  }
})

export default router
