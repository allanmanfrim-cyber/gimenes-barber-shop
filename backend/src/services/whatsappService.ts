import axios from 'axios'
import { db } from '../database/init.js'

const phoneId = process.env.WHATSAPP_PHONE_ID || ''
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ''

export interface WhatsAppMessage {
  to: string
  message: string
}

export const WhatsAppService = {
  isConfigured: (): boolean => {
    return !!phoneId && !!accessToken && phoneId !== '' && accessToken !== ''
  },

  formatPhoneNumber: (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }
    
    if (!cleaned.startsWith('55')) {
      cleaned = '55' + cleaned
    }
    
    return cleaned
  },

  sendMessage: async (to: string, message: string): Promise<{ success: boolean; error?: string }> => {
    const formattedPhone = WhatsAppService.formatPhoneNumber(to)

    if (!WhatsAppService.isConfigured()) {
      console.log(`[SIMULACAO WhatsApp] Para: ${formattedPhone}`)
      console.log(`[SIMULACAO WhatsApp] Mensagem: ${message}`)
      return { success: true }
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      }
    }
  },

  sendTemplate: async (
    to: string, 
    templateName: string, 
    languageCode: string = 'pt_BR',
    components?: any[]
  ): Promise<{ success: boolean; error?: string }> => {
    const formattedPhone = WhatsAppService.formatPhoneNumber(to)

    if (!WhatsAppService.isConfigured()) {
      console.log(`[SIMULACAO WhatsApp Template] Para: ${formattedPhone}`)
      console.log(`[SIMULACAO WhatsApp Template] Template: ${templateName}`)
      return { success: true }
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return { success: true }
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp Template:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      }
    }
  },

  sendConfirmation: async (appointmentId: number) => {
    try {
      const apt = db.prepare(`
        SELECT 
          a.*,
          c.name as client_name,
          c.whatsapp as client_whatsapp,
          b.name as barber_name,
          b.whatsapp as barber_whatsapp,
          s.name as service_name,
          p.status as payment_status
        FROM appointments a
        JOIN clients c ON a.client_id = c.id
        JOIN barbers b ON a.barber_id = b.id
        JOIN services s ON a.service_id = s.id
        LEFT JOIN payments p ON p.appointment_id = a.id
        WHERE a.id = ?
      `).get(appointmentId) as any

      if (!apt) return

      const date = new Date(apt.date_time).toLocaleDateString('pt-BR')
      const time = new Date(apt.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      
      const paymentStatus = apt.payment_status === 'paid' || apt.payment_status === 'completed' ? 'PAGO' : 'PENDENTE'

      // Message for Client
      const clientMsg = MessageTemplates.appointmentConfirmedClient({
        serviceName: apt.service_name,
        barberName: apt.barber_name,
        date,
        time,
        paymentStatus
      })

      // Message for Barber
      const barberMsg = MessageTemplates.appointmentConfirmedBarber({
        clientName: apt.client_name,
        serviceName: apt.service_name,
        date,
        time,
        paymentStatus,
        notes: apt.notes
      })

      const referenceImages = apt.reference_images ? JSON.parse(apt.reference_images) : []

      // Log the messages
      db.prepare('INSERT INTO notification_logs (type, client_id, message, status) VALUES (?, ?, ?, ?)')
        .run('confirmation_client', apt.client_id, clientMsg, 'logged')
      
      db.prepare('INSERT INTO notification_logs (type, client_id, message, status) VALUES (?, ?, ?, ?)')
        .run('confirmation_barber', apt.client_id, barberMsg + (referenceImages.length > 0 ? ` (+${referenceImages.length} fotos)` : ''), 'logged')
      
      // Try real sending
      await WhatsAppService.sendMessage(apt.client_whatsapp, clientMsg)
      if (apt.barber_whatsapp) {
        await WhatsAppService.sendMessage(apt.barber_whatsapp, barberMsg)
      }
      
    } catch (error) {
      console.error('Error sending WhatsApp confirmation:', error)
    }
  }
}

export const MessageTemplates = {
  appointmentConfirmedClient: (data: {
    serviceName: string
    barberName: string
    date: string
    time: string
    paymentStatus: string
  }): string => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'
    
    return `${businessName} - Agendamento Confirmado! 🎉

✂ Servico: ${data.serviceName}
🗓 Data: ${data.date}
⏰ Horario: ${data.time}
💈 Barbeiro: ${data.barberName}
💳 Pagamento: ${data.paymentStatus}

Aguardamos voce! 💈`
  },

  appointmentConfirmedBarber: (data: {
    clientName: string
    serviceName: string
    date: string
    time: string
    paymentStatus: string
    notes?: string
  }): string => {
    let message = `Novo Agendamento! ✂

👤 Cliente: ${data.clientName}
✂ Servico: ${data.serviceName}
🗓 Data: ${data.date} as ${data.time}
💳 Pagamento: ${data.paymentStatus}`

    if (data.notes) {
      message += `\n\nObs: ${data.notes}`
    }

    return message
  },

  appointmentCancelled: (data: {
    serviceName: string
    date: string
    time: string
    isClient: boolean
  }): string => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'
    
    if (data.isClient) {
      return `${businessName} - Agendamento Cancelado ❌

Seu agendamento foi cancelado:
Servico: ${data.serviceName}
Data: ${data.date} as ${data.time}

Para reagendar, acesse nosso site.`
    }

    return `Agendamento Cancelado ❌

O seguinte agendamento foi cancelado:
Servico: ${data.serviceName}
Data: ${data.date} as ${data.time}`
  },

  appointmentChanged: (data: {
    serviceName: string
    oldDate: string
    oldTime: string
    newDate: string
    newTime: string
    isClient: boolean
  }): string => {
    const businessName = process.env.BUSINESS_NAME || 'Gimenes Barber Shop'
    
    if (data.isClient) {
      return `${businessName} - Horario Alterado 🗓

Seu agendamento foi alterado:
Servico: ${data.serviceName}

De: ${data.oldDate} as ${data.oldTime}
Para: ${data.newDate} as ${data.newTime}

Aguardamos voce!`
    }

    return `Horario de Agendamento Alterado 🗓

Servico: ${data.serviceName}
De: ${data.oldDate} as ${data.oldTime}
Para: ${data.newDate} as ${data.newTime}`
  }
}
