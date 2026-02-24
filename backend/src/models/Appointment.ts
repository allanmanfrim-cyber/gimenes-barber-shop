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
    case 'paid_card': return 'Pago via Cartão'
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

  const paymentStatus = getPaymentStatusText(
    appointment.payment?.status || 'pending'
  )

  if (appointment.client?.whatsapp) {
    const message = MessageTemplates.appointmentConfirmedClient({
      serviceName: appointment.service?.name || '',
      barberName: appointment.barber?.name || '',
      date,
      time,
      paymentStatus
    })

    await WhatsAppService.sendMessage(appointment.client.whatsapp, message)
  }

  if (appointment.client?.email) {
    const emailData = EmailTemplates.appointmentConfirmedClient({
      clientName: appointment.client.name,
      serviceName: appointment.service?.name || '',
      barberName: appointment.barber?.name || '',
      date,
      time,
      price: appointment.service?.price || 0,
      paymentStatus
    })

    await EmailService.sendEmail({
      to: appointment.client.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    })
  }

  const barber = BarberModel.findById(appointment.barber_id)

  if (barber?.whatsapp) {
    const message = MessageTemplates.appointmentConfirmedBarber({
      clientName: appointment.client?.name || '',
      serviceName: appointment.service?.name || '',
      date,
      time,
      paymentStatus,
      notes: appointment.notes || undefined
    })

    await WhatsAppService.sendMessage(barber.whatsapp, message)
  }

  if (barber?.email) {
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

    await EmailService.sendEmail({
      to: barber.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    })
  }
}

export async function notifyAppointmentCancelled(appointment: Appointment): Promise<void> {
  const { date, time } = formatDateTime(appointment.date_time)

  if (appointment.client?.whatsapp) {
    const message = MessageTemplates.appointmentCancelled({
      serviceName: appointment.service?.name || '',
      date,
      time,
      isClient: true
    })

    await WhatsAppService.sendMessage(appointment.client.whatsapp, message)
  }

  const barber = BarberModel.findById(appointment.barber_id)

  if (barber?.whatsapp) {
    const message = MessageTemplates.appointmentCancelled({
      serviceName: appointment.service?.name || '',
      date,
      time,
      isClient: false
    })

    await WhatsAppService.sendMessage(barber.whatsapp, message)
  }
}

export async function notifyAppointmentChanged(
  appointment: Appointment,
  oldDateTime: string
): Promise<void> {

  const oldDt = formatDateTime(oldDateTime)
  const newDt = formatDateTime(appointment.date_time)

  if (appointment.client?.whatsapp) {
    const message = MessageTemplates.appointmentChanged({
      serviceName: appointment.service?.name || '',
      oldDate: oldDt.date,
      oldTime: oldDt.time,
      newDate: newDt.date,
      newTime: newDt.time,
      isClient: true
    })

    await WhatsAppService.sendMessage(appointment.client.whatsapp, message)
  }

  const barber = BarberModel.findById(appointment.barber_id)

  if (barber?.whatsapp) {
    const message = MessageTemplates.appointmentChanged({
      serviceName: appointment.service?.name || '',
      oldDate: oldDt.date,
      oldTime: oldDt.time,
      newDate: newDt.date,
      newTime: newDt.time,
      isClient: false
    })

    await WhatsAppService.sendMessage(barber.whatsapp, message)
  }
}