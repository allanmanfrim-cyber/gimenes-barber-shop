import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Appointment } from '../models/Appointment.js'
import { NotificationModel } from '../models/Notification.js'
import { BarberModel } from '../models/Barber.js'
import { WhatsAppService, MessageTemplates } from './whatsappService.js'
import { EmailService, EmailTemplates } from './emailService.js'

function getPaymentStatusText(status: string): string {
  switch (status) {
    case 'paid_pix': return 'Pago via Pix'
    case 'paid_card': return 'Pago via Cartao'
    case 'pay_on_site': return 'Pagar no local'
    case 'pending': return 'Aguardando pagamento'
    case 'cancelled': return 'Cancelado'
    default: return status
  }
}

function formatDateTime(dateTime: string): { date: string; time: string } {
  const dt = new Date(dateTime)
  return {
    date: format(dt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    time: format(dt, 'HH:mm')
  }
}

export async function notifyAppointmentConfirmed(appointment: Appointment): Promise<void> {
  const { date, time } = formatDateTime(appointment.date_time)
  const paymentStatus = getPaymentStatusText(appointment.payment_status)

  if (appointment.client?.whatsapp) {
    const alreadySent = NotificationModel.exists(
      appointment.id,
      'whatsapp',
      'client',
      appointment.client.whatsapp
    )

    if (!alreadySent) {
      const notification = NotificationModel.create({
        appointmentId: appointment.id,
        type: 'whatsapp',
        recipientType: 'client',
        recipientContact: appointment.client.whatsapp
      })

      const message = MessageTemplates.appointmentConfirmedClient({
        serviceName: appointment.service?.name || '',
        barberName: appointment.barber?.name || '',
        date,
        time,
        paymentStatus
      })

      const result = await WhatsAppService.sendMessage(appointment.client.whatsapp, message)

      if (result.success) {
        NotificationModel.markSent(notification.id)
      } else {
        NotificationModel.markFailed(notification.id, result.error || 'Erro desconhecido')
      }
    }
  }

  if (appointment.client?.email) {
    const alreadySent = NotificationModel.exists(
      appointment.id,
      'email',
      'client',
      appointment.client.email
    )

    if (!alreadySent) {
      const notification = NotificationModel.create({
        appointmentId: appointment.id,
        type: 'email',
        recipientType: 'client',
        recipientContact: appointment.client.email
      })

      const emailData = EmailTemplates.appointmentConfirmedClient({
        clientName: appointment.client.name,
        serviceName: appointment.service?.name || '',
        barberName: appointment.barber?.name || '',
        date,
        time,
        price: appointment.service?.price || 0,
        paymentStatus
      })

      const result = await EmailService.sendEmail({
        to: appointment.client.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      })

      if (result.success) {
        NotificationModel.markSent(notification.id)
      } else {
        NotificationModel.markFailed(notification.id, result.error || 'Erro desconhecido')
      }
    }
  }

  const barber = BarberModel.findById(appointment.barber_id)

  if (barber?.whatsapp) {
    const alreadySent = NotificationModel.exists(
      appointment.id,
      'whatsapp',
      'barber',
      barber.whatsapp
    )

    if (!alreadySent) {
      const notification = NotificationModel.create({
        appointmentId: appointment.id,
        type: 'whatsapp',
        recipientType: 'barber',
        recipientContact: barber.whatsapp
      })

      const message = MessageTemplates.appointmentConfirmedBarber({
        clientName: appointment.client?.name || '',
        serviceName: appointment.service?.name || '',
        date,
        time,
        paymentStatus,
        notes: appointment.notes || undefined
      })

      const result = await WhatsAppService.sendMessage(barber.whatsapp, message)

      if (result.success) {
        NotificationModel.markSent(notification.id)
      } else {
        NotificationModel.markFailed(notification.id, result.error || 'Erro desconhecido')
      }
    }
  }

  if (barber?.email) {
    const alreadySent = NotificationModel.exists(
      appointment.id,
      'email',
      'barber',
      barber.email
    )

    if (!alreadySent) {
      const notification = NotificationModel.create({
        appointmentId: appointment.id,
        type: 'email',
        recipientType: 'barber',
        recipientContact: barber.email
      })

      const emailData = EmailTemplates.appointmentConfirmedBarber({
        barberName: barber.name,
        clientName: appointment.client?.name || '',
        clientWhatsapp: appointment.client?.whatsapp || '',
        serviceName: appointment.service?.name || '',
        date,
        time,
        price: appointment.service?.price || 0,
        paymentStatus,
        notes: appointment.notes || undefined
      })

      const result = await EmailService.sendEmail({
        to: barber.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      })

      if (result.success) {
        NotificationModel.markSent(notification.id)
      } else {
        NotificationModel.markFailed(notification.id, result.error || 'Erro desconhecido')
      }
    }
  }
}