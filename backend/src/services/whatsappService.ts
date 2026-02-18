import axios from 'axios'

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
      const response = await axios.post(
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
      const response = await axios.post(
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
    
    return `${businessName} - Agendamento Confirmado!

Servico: ${data.serviceName}
Data: ${data.date}
Horario: ${data.time}
Barbeiro: ${data.barberName}
Pagamento: ${data.paymentStatus}

Aguardamos voce!`
  },

  appointmentConfirmedBarber: (data: {
    clientName: string
    serviceName: string
    date: string
    time: string
    paymentStatus: string
    notes?: string
  }): string => {
    let message = `Novo Agendamento!

Cliente: ${data.clientName}
Servico: ${data.serviceName}
Data: ${data.date} as ${data.time}
Pagamento: ${data.paymentStatus}`

    if (data.notes) {
      message += `\nObs: ${data.notes}`
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
      return `${businessName} - Agendamento Cancelado

Seu agendamento foi cancelado:
Servico: ${data.serviceName}
Data: ${data.date} as ${data.time}

Para reagendar, acesse nosso site.`
    }

    return `Agendamento Cancelado

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
      return `${businessName} - Horario Alterado

Seu agendamento foi alterado:
Servico: ${data.serviceName}

De: ${data.oldDate} as ${data.oldTime}
Para: ${data.newDate} as ${data.newTime}

Aguardamos voce!`
    }

    return `Horario de Agendamento Alterado

Servico: ${data.serviceName}
De: ${data.oldDate} as ${data.oldTime}
Para: ${data.newDate} as ${data.newTime}`
  }
}
